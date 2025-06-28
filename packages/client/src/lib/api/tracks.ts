import { create } from "@bufbuild/protobuf";
import { ok, err } from "neverthrow";
import { tracksClient } from "./client";
import {
  GetTracksRequestSchema,
  GetTrackRequestSchema,
  CreateTrackRequestSchema,
  UpdateTrackRequestSchema,
  DeleteTrackRequestSchema,
  DeleteTracksRequestSchema,
  UploadTrackRequestSchema,
  DeleteTrackFileRequestSchema,
  SortOrder,
  SortField,
} from "@music-app/common";
import { readFileAsArrayBuffer } from "../utils/files";

const mapSortField = (sort?: string): SortField => {
    switch (sort) {
        case "title": return SortField.TITLE;
        case "artist": return SortField.ARTIST;
        case "album": return SortField.ALBUM;
        case "createdAt": return SortField.CREATED_AT;
        default: return SortField.UNSPECIFIED;
    }
}

const mapSortOrder = (order?: string): SortOrder => {
  switch (order) {
    case "asc": return SortOrder.ASC;
    case "desc": return SortOrder.DESC;
    default: return SortOrder.UNSPECIFIED;
  }
};

export const getTracks = async (queryParams: {
    page?: number;
    limit?: number;
    sort?: string;
    order?: string;
    search?: string;
    genre?: string;
    artist?: string;
} = {}) => {
  try {
    const request = create(GetTracksRequestSchema, {
      queryParams: {
        page: queryParams.page,
        limit: queryParams.limit,
        sort: mapSortField(queryParams.sort),
        order: mapSortOrder(queryParams.order),
        search: queryParams.search,
        genre: queryParams.genre,
        artist: queryParams.artist,
      },
    });

    const response = await tracksClient.getTracks(request);
    
    return ok({
      data: response.data,
      meta: response.meta!,
    });
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to get tracks"));
  }
};

export const getTrack = async (slug: string) => {
  try {
    const request = create(GetTrackRequestSchema, { slug });
    const response = await tracksClient.getTrack(request);
    
    if (!response.track) {
      return err(new Error("Track not found"));
    }
    
    return ok(response.track);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to get track"));
  }
};

export const createTrack = async (track: {
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  coverImage?: string;
}) => {
  try {
    const request = create(CreateTrackRequestSchema, track);
    const response = await tracksClient.createTrack(request);
    
    if (!response.track) {
      return err(new Error("Failed to create track"));
    }
    
    return ok(response.track);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to create track"));
  }
};

export const updateTrack = async (id: string, track: {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
  coverImage?: string;
  audioFile?: string;
}) => {
  try {
    const request = create(UpdateTrackRequestSchema, {
      id,
      ...track,
    });

    const response = await tracksClient.updateTrack(request);
    
    if (!response.track) {
      return err(new Error("Failed to update track"));
    }
    
    return ok(response.track);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to update track"));
  }
};

export const deleteTrack = async (id: string) => {
  try {
    const request = create(DeleteTrackRequestSchema, { id });
    const response = await tracksClient.deleteTrack(request);
    
    if (!response.success) {
      return err(new Error(response.message || "Failed to delete track"));
    }
    
    return ok(undefined);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to delete track"));
  }
};

export const deleteTracks = async (ids: string[]) => {
  try {
    const request = create(DeleteTracksRequestSchema, { ids });
    const response = await tracksClient.deleteTracks(request);
    
    return ok({
      success: response.success,
      failed: response.failed,
    });
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to delete tracks"));
  }
};

export const uploadTrack = async (id: string, file: File) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const fileData = new Uint8Array(arrayBuffer);
    
    const request = create(UploadTrackRequestSchema, {
      trackId: id,
      fileName: file.name,
      contentType: file.type,
      fileData,
    });

    const response = await tracksClient.uploadTrack(request);
    
    if (!response.track) {
      return err(new Error("Upload completed but no track returned"));
    }
    
    return ok(response.track);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to upload track"));
  }
};

export const deleteTrackFile = async (id: string) => {
  try {
    const request = create(DeleteTrackFileRequestSchema, { id });
    const response = await tracksClient.deleteTrackFile(request);
    
    if (!response.success) {
      return err(new Error(response.message || "Failed to delete track file"));
    }
    
    return ok(undefined);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to delete track file"));
  }
};

