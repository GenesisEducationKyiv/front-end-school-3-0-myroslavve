import { create } from "@bufbuild/protobuf";
import { ConnectError, Code } from "@connectrpc/connect";
import type { ServiceImpl } from "@connectrpc/connect";
import {
  GenresService,
  type GetGenresRequest,
  GetGenresResponseSchema,
} from "@music-app/common";

import { getGenres } from "../utils/db";

export const genresServiceImpl: ServiceImpl<typeof GenresService> = {
  async getGenres(req: GetGenresRequest) {
    try {
      const genres = await getGenres();
      
      return create(GetGenresResponseSchema, {
        genres,
      });
    } catch (error) {
      throw new ConnectError(
        error instanceof Error ? error.message : "Failed to get genres",
        Code.Internal
      );
    }
  },
};