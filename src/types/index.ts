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
    /** Whether the track is currently playing */
    isPlaying?: boolean;
}

export interface CreateTrackDto {
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    coverImage?: string;
}

export interface UpdateTrackDto {
    title?: string;
    artist?: string;
    album?: string;
    genres?: string[];
    coverImage?: string;
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
