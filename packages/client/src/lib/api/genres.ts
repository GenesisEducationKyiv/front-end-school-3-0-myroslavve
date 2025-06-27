import { create } from "@bufbuild/protobuf";
import { ok, err } from "neverthrow";
import { genresClient } from "./client";
import { GetGenresRequestSchema } from "@music-app/common";

export const getGenres = async () => {
  try {
    const request = create(GetGenresRequestSchema, {});
    const response = await genresClient.getGenres(request);
    
    return ok(response.genres);
  } catch (error) {
    return err(new Error(error instanceof Error ? error.message : "Failed to get genres"));
  }
};
