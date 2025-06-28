import {
  createTrack, 
  deleteTrack, 
  getTrackById, 
  getTrackBySlug, 
  getTracks, 
  updateTrack,
  deleteMultipleTracks,
  saveAudioFile,
  deleteAudioFile
} from '../utils/db';
import { createSlug } from '../utils/slug';
import { 
  Track,
  CreateTrackDto, 
  UpdateTrackDto,
  RouteHandler,
  GetTrackParams,
  GetTrackByIdParams,
  UpdateTrackParams,
  CreateTrackRequest,
  ListTracksQuery,
  DeleteTracksRequest,
  FileUploadParams,
  PaginatedResponse,
  BatchDeleteResponse
} from '../types';

/**
 * Get all tracks with pagination, sorting, and filtering
 */
export const getAllTracks: RouteHandler<ListTracksQuery> = async (
  request,
  reply
) => {
  try {
    const { tracks, total } = await getTracks(request.query);
    
    const page = request.query.page || 1;
    const limit = request.query.limit || 10;
    
    const response: PaginatedResponse<Track> = {
      data: tracks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
    
    return reply.code(200).send(response);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Get a track by its slug
 */
export const getTrack: RouteHandler<GetTrackParams> = async (
  request,
  reply
) => {
  try {
    const { slug } = request.params;
    const track = await getTrackBySlug(slug);
    
    if (!track) {
      return reply.code(404).send({ error: 'Track not found' });
    }
    
    return reply.code(200).send(track);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Create a new track
 */
export const addTrack: RouteHandler<CreateTrackRequest> = async (
  request,
  reply
) => {
  try {
    const { title, artist, album = "", genres = [], coverImage = "" } = request.body;
    
    if (!title || !artist) {
      return reply.code(400).send({ error: 'Title and artist are required' });
    }
    
    if (!genres || !Array.isArray(genres)) {
      return reply.code(400).send({ error: 'Genres must be an array' });
    }
    
    const slug = createSlug(title);
    
    const existingTrack = await getTrackBySlug(slug);
    if (existingTrack) {
      return reply.code(409).send({ error: 'A track with this title already exists' });
    }
    
    const newTrack = await createTrack({
      title,
      artist,
      album,
      genres,
      coverImage,
      slug
    });
    
    return reply.code(201).send(newTrack);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Update a track by ID
 */
export const updateTrackById: RouteHandler<UpdateTrackParams> = async (
  request,
  reply
) => {
  try {
    const { id } = request.params;
    const { title, artist, album, genres, coverImage } = request.body;
    
    const existingTrack = await getTrackById(id);
    if (!existingTrack) {
      return reply.code(404).send({ error: 'Track not found' });
    }
    
    // If title is being updated, update the slug as well
    let updates: Partial<UpdateTrackDto & { slug?: string }> = { ...request.body };
    
    if (title && title !== existingTrack.title) {
      const newSlug = createSlug(title);
      
      // Check if the new slug already exists on a different track
      const trackWithSameSlug = await getTrackBySlug(newSlug);
      if (trackWithSameSlug && trackWithSameSlug.id !== id) {
        return reply.code(409).send({ error: 'A track with this title already exists' });
      }
      
      updates.slug = newSlug;
    }
    
    const updatedTrack = await updateTrack(id, updates);
    
    return reply.code(200).send(updatedTrack);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Delete a track by ID
 */
export const removeTrack: RouteHandler<GetTrackByIdParams> = async (
  request,
  reply
) => {
  try {
    const { id } = request.params;
    
    const success = await deleteTrack(id);
    
    if (!success) {
      return reply.code(404).send({ error: 'Track not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Delete multiple tracks
 */
export const removeTracks: RouteHandler<DeleteTracksRequest> = async (
  request,
  reply
) => {
  try {
    const { ids } = request.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return reply.code(400).send({ error: 'Track IDs are required' });
    }
    
    const results: BatchDeleteResponse = await deleteMultipleTracks(ids);
    
    return reply.code(200).send(results);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Upload an audio file for a track
 */
export const uploadTrackFile: RouteHandler<FileUploadParams> = async (
  request,
  reply
) => {
  try {
    const { id } = request.params;
    
    const existingTrack = await getTrackById(id);
    if (!existingTrack) {
      return reply.code(404).send({ error: 'Track not found' });
    }
    
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    
    // Validate file type
    const allowedMimeTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-wav'];
    if (!allowedMimeTypes.includes(data.mimetype)) {
      return reply.code(400).send({ 
        error: 'Invalid file type. Only MP3 and WAV files are allowed.' 
      });
    }
    
    // Get file buffer
    const buffer = await data.toBuffer();
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      return reply.code(400).send({ 
        error: 'File is too large. Maximum size is 10MB.' 
      });
    }
    
    // Save file and update track
    const fileName = await saveAudioFile(id, data.filename, buffer);
    
    const updatedTrack = await updateTrack(id, { audioFile: fileName });
    
    return reply.code(200).send(updatedTrack);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};

/**
 * Delete an audio file from a track
 */
export const deleteTrackFile: RouteHandler<FileUploadParams> = async (
  request,
  reply
) => {
  try {
    const { id } = request.params;
    
    const existingTrack = await getTrackById(id);
    if (!existingTrack) {
      return reply.code(404).send({ error: 'Track not found' });
    }
    
    if (!existingTrack.audioFile) {
      return reply.code(404).send({ error: 'Track has no audio file' });
    }
    
    const success = await deleteAudioFile(id);
    
    if (!success) {
      return reply.code(500).send({ error: 'Failed to delete audio file' });
    }
    
    const updatedTrack = await getTrackById(id);
    
    return reply.code(200).send(updatedTrack);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};