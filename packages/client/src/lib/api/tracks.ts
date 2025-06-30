import { ok, err } from "neverthrow";
import { tracksClient } from "./client";
import { readFileAsArrayBuffer } from "../utils/files";
import { QueryParams } from "./schemas";
import { getSortField, getSortOrder } from "../utils/query-params";

export const getTracks = async (queryParams: QueryParams) => {
  try {
    const response = await tracksClient.getTracks({
      queryParams: {
        ...queryParams,
        sort: getSortField(queryParams.sort),
        order: getSortOrder(queryParams.order),
      },
    });
    
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
    const response = await tracksClient.getTrack({ slug });
    
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
    const response = await tracksClient.createTrack(track);
    
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
    const response = await tracksClient.updateTrack({
      id,
      ...track,
    });
    
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
    const response = await tracksClient.deleteTrack({ id });
    
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
    const response = await tracksClient.deleteTracks({ ids });
    
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
    
    const response = await tracksClient.uploadTrack({
      trackId: id,
      fileName: file.name,
      contentType: file.type,
      fileData,
    });
    
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
    const response = await tracksClient.deleteTrackFile({ id });
    
    if (!response.success) {
      return err(new Error(response.message || "Failed to delete track file"));
    }
    
    return ok(undefined);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to delete track file"));
  }
};

