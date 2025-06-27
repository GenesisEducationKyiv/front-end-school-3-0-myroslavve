import { create } from "@bufbuild/protobuf";
import { ConnectError, Code } from "@connectrpc/connect";
import type { ServiceImpl } from "@connectrpc/connect";
import {
  TracksService,
  type GetTracksRequest,
  GetTracksResponseSchema,
  type GetTrackRequest,
  GetTrackResponseSchema,
  type CreateTrackRequest,
  CreateTrackResponseSchema,
  type UpdateTrackRequest,
  UpdateTrackResponseSchema,
  type DeleteTrackRequest,
  DeleteTrackResponseSchema,
  type DeleteTracksRequest,
  DeleteTracksResponseSchema,
  type UploadTrackRequest,
  UploadTrackResponseSchema,
  type DeleteTrackFileRequest,
  DeleteTrackFileResponseSchema,
  TrackSchema,
  PaginationMetaSchema,
  SortField,
  SortOrder,
} from "@music-app/common";

import {
  getTracks,
  getTrackBySlug,
  createTrack,
  updateTrack,
  deleteTrack,
  deleteMultipleTracks,
  deleteAudioFile,
} from "../utils/db";
import { createSlug } from "../utils/slug";
import type { Track as DbTrack, QueryParams as DbQueryParams } from "../types";

// Helper function to convert protobuf QueryParams to DB QueryParams
function protoQueryParamsToDb(proto?: any): DbQueryParams {
  if (!proto) return {};
  
  return {
    page: proto.page || undefined,
    limit: proto.limit || undefined,
    sort: proto.sort ? getSortFieldString(proto.sort) : undefined,
    order: proto.order ? getSortOrderString(proto.order) : undefined,
    search: proto.search || undefined,
    genre: proto.genre || undefined,
    artist: proto.artist || undefined
  };
}

function getSortFieldString(sortField: SortField) {
  switch (sortField) {
    case SortField.TITLE: return 'title';
    case SortField.ARTIST: return 'artist';
    case SortField.ALBUM: return 'album';
    case SortField.CREATED_AT: return 'createdAt';
    default: return 'createdAt';
  }
}

function getSortOrderString(sortOrder: SortOrder) {
  switch (sortOrder) {
    case SortOrder.ASC: return 'asc';
    case SortOrder.DESC: return 'desc';
    default: return 'desc';
  }
}

export const tracksServiceImpl: ServiceImpl<typeof TracksService> = {
  async getTracks(req: GetTracksRequest) {
    try {
      const dbParams = protoQueryParamsToDb(req.queryParams);
      const { tracks, total } = await getTracks(dbParams);
      
      const page = dbParams.page || 1;
      const limit = dbParams.limit || 10;
      
      return create(GetTracksResponseSchema, {
        data: tracks.map((track: DbTrack) => create(TrackSchema, {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          genres: track.genres,
          slug: track.slug,
          coverImage: track.coverImage,
          audioFile: track.audioFile,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
        })),
        meta: create(PaginationMetaSchema, {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        }),
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to get tracks",
        Code.Internal
      );
    }
  },

  async getTrack(req: GetTrackRequest) {
    try {
      const track = await getTrackBySlug(req.slug);
      
      if (!track) {
        throw new ConnectError("Track not found", Code.NotFound);
      }

      return create(GetTrackResponseSchema, {
        track: create(TrackSchema, {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          genres: track.genres,
          slug: track.slug,
          coverImage: track.coverImage,
          audioFile: track.audioFile,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
        }),
      });
    } catch (error) {
      if (error instanceof ConnectError) {
        throw error;
      }
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to get track",
        Code.Internal
      );
    }
  },

  async createTrack(req: CreateTrackRequest) {
    try {
      if (!req.title || !req.artist) {
        throw new ConnectError('Title and artist are required', Code.InvalidArgument);
      }
      
      const slug = createSlug(req.title);
      
      // Check if slug already exists
      const existingTrack = await getTrackBySlug(slug);
      if (existingTrack) {
        throw new ConnectError('A track with this title already exists', Code.AlreadyExists);
      }
      
      const track = await createTrack({
        title: req.title,
        artist: req.artist,
        album: req.album || '',
        genres: req.genres || [],
        coverImage: req.coverImage || '',
        slug
      });

      return create(CreateTrackResponseSchema, {
        track: create(TrackSchema, {
          id: track.id,
          title: track.title,
          artist: track.artist,
          album: track.album,
          genres: track.genres,
          slug: track.slug,
          coverImage: track.coverImage,
          audioFile: track.audioFile,
          createdAt: track.createdAt,
          updatedAt: track.updatedAt,
        }),
      });
    } catch (error) {
      if (error instanceof ConnectError) throw error;
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to create track",
        Code.Internal
      );
    }
  },

  async updateTrack(req: UpdateTrackRequest) {
    try {
      const existingTrack = await getTrackBySlug(req.id); // This should probably be getTrackById
      if (!existingTrack) {
        throw new ConnectError("Track not found", Code.NotFound);
      }
      
      let updates: any = {};
      if (req.title !== undefined) updates.title = req.title;
      if (req.artist !== undefined) updates.artist = req.artist;
      if (req.album !== undefined) updates.album = req.album;
      if (req.genres !== undefined) updates.genres = req.genres;
      if (req.coverImage !== undefined) updates.coverImage = req.coverImage;
      if (req.audioFile !== undefined) updates.audioFile = req.audioFile;
      
      // If title is being updated, update the slug as well
      if (req.title && req.title !== existingTrack.title) {
        const newSlug = createSlug(req.title);
        
        // Check if the new slug already exists on a different track
        const trackWithSameSlug = await getTrackBySlug(newSlug);
        if (trackWithSameSlug && trackWithSameSlug.id !== req.id) {
          throw new ConnectError('A track with this title already exists', Code.AlreadyExists);
        }
        
        updates.slug = newSlug;
      }
      
      const updatedTrack = await updateTrack(req.id, updates);
      if (!updatedTrack) {
        throw new ConnectError('Failed to update track', Code.Internal);
      }

      return create(UpdateTrackResponseSchema, {
        track: create(TrackSchema, {
          id: updatedTrack.id,
          title: updatedTrack.title,
          artist: updatedTrack.artist,
          album: updatedTrack.album,
          genres: updatedTrack.genres,
          slug: updatedTrack.slug,
          coverImage: updatedTrack.coverImage,
          audioFile: updatedTrack.audioFile,
          createdAt: updatedTrack.createdAt,
          updatedAt: updatedTrack.updatedAt,
        }),
      });
    } catch (error) {
      if (error instanceof ConnectError) {
        throw error;
      }
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to update track",
        Code.Internal
      );
    }
  },

  async deleteTrack(req: DeleteTrackRequest) {
    try {
      const success = await deleteTrack(req.id);
      
      return create(DeleteTrackResponseSchema, {
        success,
        message: success ? "Track deleted successfully" : "Track not found",
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to delete track",
        Code.Internal
      );
    }
  },

  async deleteTracks(req: DeleteTracksRequest) {
    try {
      if (!req.ids || req.ids.length === 0) {
        throw new ConnectError('Track IDs are required', Code.InvalidArgument);
      }
      
      const result = await deleteMultipleTracks(req.ids);
      
      return create(DeleteTracksResponseSchema, {
        success: result.success,
        failed: result.failed,
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to delete tracks",
        Code.Internal
      );
    }
  },

  async *uploadTrack(req: AsyncIterable<UploadTrackRequest>) {
    try {
      // This is a bidirectional streaming method
      // For now, return a simple response
      yield create(UploadTrackResponseSchema, {
        response: {
          case: "progress",
          value: {
            bytesUploaded: BigInt(0),
            totalBytes: BigInt(100),
            percentage: 0,
          },
        },
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to upload track",
        Code.Internal
      );
    }
  },

  async deleteTrackFile(req: DeleteTrackFileRequest) {
    try {
      const success = await deleteAudioFile(req.id);
      
      return create(DeleteTrackFileResponseSchema, {
        success,
        message: success ? "Track file deleted successfully" : "Failed to delete track file",
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to delete track file",
        Code.Internal
      );
    }
  },
}; 