import { FastifyReply, FastifyRequest, RequestGenericInterface } from 'fastify';
import { MultipartFile } from '@fastify/multipart';

/**
 * Core domain entities
 */

/**
 * Track entity representing a music track in the system
 */
export interface Track {
  /** Unique identifier for the track */
  id: string;
  /** Title of the track */
  title: string;
  /** Artist who created the track */
  artist: string;
  /** Optional album the track belongs to */
  album?: string;
  /** List of genres associated with the track */
  genres: string[];
  /** URL-friendly version of the title (kebab-case) */
  slug: string;
  /** Optional URL to the track's cover image */
  coverImage?: string;
  /** Optional filename of the uploaded audio file */
  audioFile?: string;
  /** ISO timestamp of when the track was created */
  createdAt: string;
  /** ISO timestamp of when the track was last updated */
  updatedAt: string;
}

/**
 * DTOs (Data Transfer Objects)
 */

/**
 * Data required to create a new track
 */
export interface CreateTrackDto {
  /** Title of the track */
  title: string;
  /** Artist who created the track */
  artist: string;
  /** Optional album the track belongs to */
  album?: string;
  /** List of genres associated with the track */
  genres: string[];
  /** Optional URL to the track's cover image */
  coverImage?: string;
}

/**
 * Data for updating an existing track (all fields optional)
 */
export interface UpdateTrackDto {
  /** New title for the track */
  title?: string;
  /** New artist for the track */
  artist?: string;
  /** New album for the track */
  album?: string;
  /** New genres for the track */
  genres?: string[];
  /** New cover image URL for the track */
  coverImage?: string;
  /** New audio file for the track */
  audioFile?: string;
}

/**
 * Query parameters for listing and filtering tracks
 */
export interface QueryParams {
  /** Page number for pagination (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Field to sort results by */
  sort?: 'title' | 'artist' | 'album' | 'createdAt';
  /** Sort direction */
  order?: 'asc' | 'desc';
  /** Search term to filter tracks by title, artist, or album */
  search?: string;
  /** Filter tracks by specific genre */
  genre?: string;
  /** Filter tracks by specific artist */
  artist?: string;
}

/**
 * Response format for paginated data
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Metadata about the pagination */
  meta: {
    /** Total number of items across all pages */
    total: number;
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of pages */
    totalPages: number;
  }
}

/**
 * Response for batch delete operations
 */
export interface BatchDeleteResponse {
  /** IDs of successfully deleted items */
  success: string[];
  /** IDs that failed to delete */
  failed: string[];
}

/**
 * Request Interface Types (for FastifyRequest)
 */

export interface GetTrackParams extends RequestGenericInterface {
  Params: {
    slug: string;
  }
}

export interface GetTrackByIdParams extends RequestGenericInterface {
  Params: {
    id: string;
  }
}

export interface UpdateTrackParams extends RequestGenericInterface {
  Params: {
    id: string;
  };
  Body: UpdateTrackDto;
}

export interface CreateTrackRequest extends RequestGenericInterface {
  Body: CreateTrackDto;
}

export interface ListTracksQuery extends RequestGenericInterface {
  Querystring: QueryParams;
}

export interface DeleteTracksRequest extends RequestGenericInterface {
  Body: {
    ids: string[];
  }
}

export interface FileUploadParams extends RequestGenericInterface {
  Params: {
    id: string;
  }
}

/**
 * Handler function types
 */

export type RouteHandler<T extends RequestGenericInterface = RequestGenericInterface> = 
  (request: FastifyRequest<T>, reply: FastifyReply) => Promise<FastifyReply | void>;