import { z } from 'zod';

export const TrackDtoSchema = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    album: z.string().optional(),
    genres: z.array(z.string()),
    slug: z.string(),
    coverImage: z.string().optional(),
    audioFile: z.string().optional(),
    createdAt: z.string(),
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
    page: z.number().optional(),
    limit: z.number().optional(),
    sort: z.enum(['title', 'artist', 'album', 'createdAt']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    search: z.string().optional(),
    genre: z.string().optional(),
    artist: z.string().optional()
});

export const GenresSchema = z.array(z.string());

export const PaginationMetaSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        data: z.array(itemSchema),
        meta: PaginationMetaSchema
    });

export const BatchDeleteResponseSchema = z.object({
    success: z.array(z.string()),
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

export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>;