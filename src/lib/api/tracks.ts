import { API_URL } from "@/constants";
import { BatchDeleteResponse, CreateTrackDto, PaginatedResponse, QueryParams, Track, UpdateTrackDto } from "@/types";

const getTracks = async (params: QueryParams = {}): Promise<PaginatedResponse<Track>> => {
    const queryParams = new URLSearchParams();

    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.order) queryParams.append('order', params.order);
    if (params.search) queryParams.append('search', params.search);
    if (params.genre) queryParams.append('genre', params.genre);
    if (params.artist) queryParams.append('artist', params.artist);

    const response = await fetch(`${API_URL}/tracks?${queryParams.toString()}`);
    const json = await response.json();

    return json;
}

const createTrack = async (track: CreateTrackDto): Promise<Track> => {
    const response = await fetch(`${API_URL}/tracks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(track),
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.error || "Failed to create track");
    }

    return json;
}

const updateTrack = async (id: string, track: UpdateTrackDto): Promise<Track> => {
    const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(track),
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.error || "Failed to update track");
    }

    return json;
}

const deleteTrack = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tracks/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to delete track");
    }
}

const deleteTracks = async (ids: string[]): Promise<BatchDeleteResponse> => {
    const response = await fetch(`${API_URL}/tracks/delete`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids }),
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.error || "Failed to delete tracks");
    }

    return json;
}

const uploadTrack = async (id: string, file: File): Promise<Track> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/tracks/${id}/upload`, {
        method: "POST",
        body: formData,
    });
    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.error || "Failed to upload track");
    }

    return json;
}

const deleteTrackFile = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tracks/${id}/file`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Failed to delete track file");
    }
}

export { createTrack, deleteTrack, deleteTrackFile, deleteTracks, getTracks, updateTrack, uploadTrack };

