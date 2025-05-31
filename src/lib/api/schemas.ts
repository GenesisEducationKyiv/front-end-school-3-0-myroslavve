import { z } from 'zod';

export const TrackDtoSchema = z.object({
    /** Unique identifier for the track */
    id: z.string(),
    /** Title of the track */
    title: z.string(),
    /** Artist who created the track */
    artist: z.string(),
    /** Optional album the track belongs to */
    album: z.string().optional(),
    /** List of genres associated with the track */
    genres: z.array(z.string()),
    /** URL-friendly version of the title (kebab-case) */
    slug: z.string(),
    /** Optional URL to the track's cover image */
    coverImage: z.string().optional(),
    /** Optional filename of the uploaded audio file */
    audioFile: z.string().optional(),
    /** ISO timestamp of when the track was created */
    createdAt: z.string(),
    /** ISO timestamp of when the track was last updated */
    updatedAt: z.string(),
});

export const CreateTrackDtoSchema = z.object({
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    genres: z.array(z.string()),
    coverImage: z.string().optional()
});

export const UpdateTrackDtoSchema = z.object({
    title: z.string().optional(),
    artist: z.string().optional(),
    album: z.string().optional(),
    genres: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
    audioFile: z.string().optional()
});

export const QueryParamsSchema = z.object({
    /** Page number for pagination (1-based) */
    page: z.number().optional(),
    /** Number of items per page */
    limit: z.number().optional(),
    /** Field to sort results by */
    sort: z.enum(['title', 'artist', 'album', 'createdAt']).optional(),
    /** Sort direction */
    order: z.enum(['asc', 'desc']).optional(),
    /** Search term to filter tracks by title, artist, or album */
    search: z.string().optional(),
    /** Filter tracks by specific genre */
    genre: z.string().optional(),
    /** Filter tracks by specific artist */
    artist: z.string().optional()
});

export const GenresSchema = z.array(z.string());

export const PaginationMetaSchema = z.object({
    /** Total number of items across all pages */
    total: z.number(),
    /** Current page number */
    page: z.number(),
    /** Number of items per page */
    limit: z.number(),
    /** Total number of pages */
    totalPages: z.number()
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        /** Array of items for the current page */
        data: z.array(itemSchema),
        /** Metadata about the pagination */
        meta: PaginationMetaSchema
    });

export const BatchDeleteResponseSchema = z.object({
    /** IDs of successfully deleted items */
    success: z.array(z.string()),
    /** IDs that failed to delete */
    failed: z.array(z.string())
});

export const PaginatedTracksResponseSchema = PaginatedResponseSchema(TrackDtoSchema);

export type Track = z.infer<typeof TrackDtoSchema> & {
    isPlaying?: boolean;
};
export type CreateTrackDto = z.infer<typeof CreateTrackDtoSchema>;
export type UpdateTrackDto = z.infer<typeof UpdateTrackDtoSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type BatchDeleteResponse = z.infer<typeof BatchDeleteResponseSchema>;

export type PaginatedResponse<T> = {
    data: T[];
    meta: z.infer<typeof PaginationMetaSchema>;
}; 