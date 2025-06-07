import { 
    TrackDtoSchema, 
    PaginatedTracksResponseSchema, 
    BatchDeleteResponseSchema,
    CreateTrackDto,
    UpdateTrackDto,
    QueryParams,
} from "./schemas";
import { apiFetch } from "./api-fetch";

const getTracks = async (params: QueryParams = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.artist) queryParams.append('artist', params.artist);

    const endpoint = `/tracks?${queryParams.toString()}`;
    return apiFetch(endpoint, {
        schema: PaginatedTracksResponseSchema
    });
}

const createTrack = async (track: CreateTrackDto) => {
    return apiFetch('/tracks', {
        method: 'POST',
        body: track,
        schema: TrackDtoSchema
    });
}

const updateTrack = async (id: string, track: UpdateTrackDto) => {
    return apiFetch(`/tracks/${id}`, {
        method: 'PUT',
        body: track,
        schema: TrackDtoSchema
    });
}

const deleteTrack = async (id: string) => {
    return apiFetch(`/tracks/${id}`, {
        method: 'DELETE'
    });
}

const deleteTracks = async (ids: string[])=> {
    return apiFetch('/tracks/delete', {
        method: 'POST',
        body: { ids },
        schema: BatchDeleteResponseSchema
    });
}

const uploadTrack = async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiFetch(`/tracks/${id}/upload`, {
        method: 'POST',
        body: formData,
        schema: TrackDtoSchema
    });
}

const deleteTrackFile = async (id: string) => {
    return apiFetch(`/tracks/${id}/file`, {
        method: 'DELETE'
    });
}

export { createTrack, deleteTrack, deleteTrackFile, deleteTracks, getTracks, updateTrack, uploadTrack };

