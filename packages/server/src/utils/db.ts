import fs from 'fs/promises';
import path from 'path';
import { Track, QueryParams, BatchDeleteResponse } from '../types';
import config from '../config';

/**
 * Database file paths
 */
interface DbPaths {
  tracksDir: string;
  uploadsDir: string;
  genresFile: string;
}

/**
 * Result of getTracks with pagination
 */
interface GetTracksResult {
  tracks: Track[];
  total: number;
}

// Determine which paths to use
const isTestMode = process.env.TEST_MODE === 'true';

// Get the paths from config, which will reflect the right environment
const TRACKS_DIR = config.storage.tracksDir;
const UPLOADS_DIR = config.storage.uploadsDir;
const GENRES_FILE = config.storage.genresFile;

// Log paths in development for debugging
if (config.isDevelopment) {
  console.log('Using storage paths:');
  console.log('TRACKS_DIR:', TRACKS_DIR);
  console.log('UPLOADS_DIR:', UPLOADS_DIR);
  console.log('GENRES_FILE:', GENRES_FILE);
}

// Initialize the data directories
export const initializeDb = async (): Promise<void> => {
  try {
    await fs.mkdir(TRACKS_DIR, { recursive: true });
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    
    // Create genres file if it doesn't exist
    try {
      await fs.access(GENRES_FILE);
    } catch {
      // Default genres
      const defaultGenres = [
        'Rock', 'Pop', 'Hip Hop', 'Jazz', 'Classical', 'Electronic',
        'R&B', 'Country', 'Folk', 'Reggae', 'Metal', 'Blues', 'Indie'
      ];
      await fs.writeFile(GENRES_FILE, JSON.stringify(defaultGenres, null, 2));
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

/**
 * Get all available music genres
 * @returns Array of genre names
 */
export const getGenres = async (): Promise<string[]> => {
  try {
    const data = await fs.readFile(GENRES_FILE, 'utf-8');
    return JSON.parse(data) as string[];
  } catch (error) {
    console.error('Failed to read genres:', error);
    return [];
  }
};

/**
 * Get tracks with pagination, sorting, and filtering
 * @param params Query parameters for filtering, sorting, and pagination
 * @returns Object containing tracks array and total count
 */
export const getTracks = async (params: QueryParams = {}): Promise<GetTracksResult> => {
  try {
    const files = await fs.readdir(TRACKS_DIR);
    
    let tracks: Track[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(TRACKS_DIR, file), 'utf-8');
        tracks.push(JSON.parse(content));
      }
    }
    
    // Apply filtering
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      tracks = tracks.filter(track => 
        track.title.toLowerCase().includes(searchLower) ||
        track.artist.toLowerCase().includes(searchLower) ||
        (track.album && track.album.toLowerCase().includes(searchLower))
      );
    }
    
    if (params.genre) {
      tracks = tracks.filter(track => track.genres.includes(params.genre as string));
    }
    
    if (params.artist) {
      const artistLower = params.artist.toLowerCase();
      tracks = tracks.filter(track => track.artist.toLowerCase().includes(artistLower));
    }
    
    // Apply sorting
    if (params.sort) {
      const sortField = params.sort;
      const sortOrder = params.order || 'asc';
      
      tracks.sort((a, b) => {
        const valueA = a[sortField] || '';
        const valueB = b[sortField] || '';
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortOrder === 'asc' 
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
    } else {
      // Default sort by createdAt
      tracks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    const total = tracks.length;
    
    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      tracks: tracks.slice(start, end),
      total
    };
  } catch (error) {
    console.error('Failed to read tracks:', error);
    return { tracks: [], total: 0 };
  }
};

/**
 * Get a track by its slug (URL-friendly version of title)
 * @param slug The slug to search for
 * @returns Track object if found, null otherwise
 */
export const getTrackBySlug = async (slug: string): Promise<Track | null> => {
  try {
    const files = await fs.readdir(TRACKS_DIR);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const content = await fs.readFile(path.join(TRACKS_DIR, file), 'utf-8');
        const track: Track = JSON.parse(content);
        
        if (track.slug === slug) {
          return track;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to get track by slug ${slug}:`, error);
    return null;
  }
};

/**
 * Get a track by its unique ID
 * @param id Unique identifier of the track
 * @returns Track object if found, null otherwise
 */
export const getTrackById = async (id: string): Promise<Track | null> => {
  try {
    const filePath = path.join(TRACKS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Track;
  } catch (error) {
    return null;
  }
};

/**
 * Create a new track and save it to the database
 * @param track Track data without ID and timestamps
 * @returns Complete track object with generated ID and timestamps
 */
export const createTrack = async (
  track: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Track> => {
  const id = Date.now().toString();
  const now = new Date().toISOString();
  
  const newTrack: Track = {
    ...track,
    id,
    createdAt: now,
    updatedAt: now
  };
  
  await fs.writeFile(
    path.join(TRACKS_DIR, `${id}.json`),
    JSON.stringify(newTrack, null, 2)
  );
  
  return newTrack;
};

/**
 * Update an existing track with new values
 * @param id ID of the track to update
 * @param updates Partial track object with updated fields
 * @returns Updated track object or null if track not found
 */
export const updateTrack = async (
  id: string, 
  updates: Partial<Track>
): Promise<Track | null> => {
  try {
    const track = await getTrackById(id);
    
    if (!track) {
      return null;
    }
    
    const updatedTrack: Track = {
      ...track,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(
      path.join(TRACKS_DIR, `${id}.json`),
      JSON.stringify(updatedTrack, null, 2)
    );
    
    return updatedTrack;
  } catch (error) {
    console.error(`Failed to update track ${id}:`, error);
    return null;
  }
};

/**
 * Delete a track and its associated audio file
 * @param id ID of the track to delete
 * @returns Boolean indicating success or failure
 */
export const deleteTrack = async (id: string): Promise<boolean> => {
  try {
    const track = await getTrackById(id);
    
    if (!track) {
      return false;
    }
    
    // Delete track file
    await fs.unlink(path.join(TRACKS_DIR, `${id}.json`));
    
    // Delete associated audio file if it exists
    if (track.audioFile) {
      try {
        await fs.unlink(path.join(UPLOADS_DIR, track.audioFile));
      } catch (error) {
        console.error(`Failed to delete audio file for track ${id}:`, error);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete track ${id}:`, error);
    return false;
  }
};

/**
 * Delete multiple tracks in a batch operation
 * @param ids Array of track IDs to delete
 * @returns Object containing arrays of successful and failed deletions
 */
export const deleteMultipleTracks = async (ids: string[]): Promise<BatchDeleteResponse> => {
  const results: BatchDeleteResponse = {
    success: [],
    failed: []
  };
  
  for (const id of ids) {
    const success = await deleteTrack(id);
    
    if (success) {
      results.success.push(id);
    } else {
      results.failed.push(id);
    }
  }
  
  return results;
};

/**
 * Save an uploaded audio file to disk
 * @param id ID of the associated track
 * @param fileName Original name of the uploaded file
 * @param buffer File data buffer
 * @returns Generated filename of the saved file
 */
export const saveAudioFile = async (
  id: string, 
  fileName: string, 
  buffer: Buffer
): Promise<string> => {
  const fileExt = path.extname(fileName);
  const safeFileName = `${id}${fileExt}`;
  const filePath = path.join(UPLOADS_DIR, safeFileName);
  
  await fs.writeFile(filePath, buffer);
  
  return safeFileName;
};

/**
 * Delete an audio file and remove its reference from the track
 * @param id ID of the track with the audio file to delete
 * @returns Boolean indicating success or failure
 */
export const deleteAudioFile = async (id: string): Promise<boolean> => {
  try {
    const track = await getTrackById(id);
    
    if (!track || !track.audioFile) {
      return false;
    }
    
    await fs.unlink(path.join(UPLOADS_DIR, track.audioFile));
    
    // Update track to remove audioFile reference
    await updateTrack(id, { audioFile: undefined });
    
    return true;
  } catch (error) {
    console.error(`Failed to delete audio file for track ${id}:`, error);
    return false;
  }
};