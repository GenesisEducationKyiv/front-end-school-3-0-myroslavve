import { createConnectTransport } from "@connectrpc/connect-node";
import { createClient } from "@connectrpc/connect";
import { TracksService, GenresService } from "@music-app/common";
import { create } from "@bufbuild/protobuf";
import { GetTracksRequestSchema, GetGenresRequestSchema } from "@music-app/common";

describe("gRPC Services", () => {
  const transport = createConnectTransport({
    httpVersion: "1.1",
    baseUrl: "http://localhost:8000",
  });

  const tracksClient = createClient(TracksService, transport);
  const genresClient = createClient(GenresService, transport);

  beforeAll(async () => {
    // Wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  describe("TracksService", () => {
    it("should get tracks successfully", async () => {
      const request = create(GetTracksRequestSchema, {
        queryParams: {
          page: 1,
          limit: 10,
        },
      });

      const response = await tracksClient.getTracks(request);

      expect(response).toBeDefined();
      expect(response.data).toBeDefined();
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.meta).toBeDefined();
      expect(response.meta?.total).toBeGreaterThanOrEqual(0);
    });

    it("should handle pagination correctly", async () => {
      const request = create(GetTracksRequestSchema, {
        queryParams: {
          page: 1,
          limit: 5,
        },
      });

      const response = await tracksClient.getTracks(request);

      expect(response.data.length).toBeLessThanOrEqual(5);
      expect(response.meta?.page).toBe(1);
      expect(response.meta?.limit).toBe(5);
    });
  });

  describe("GenresService", () => {
    it("should get genres successfully", async () => {
      const request = create(GetGenresRequestSchema, {});

      const response = await genresClient.getGenres(request);

      expect(response).toBeDefined();
      expect(response.genres).toBeDefined();
      expect(Array.isArray(response.genres)).toBe(true);
      expect(response.genres.length).toBeGreaterThan(0);
    });

    it("should return valid genre objects", async () => {
      const request = create(GetGenresRequestSchema, {});

      const response = await genresClient.getGenres(request);

      if (response.genres.length > 0) {
        const genre = response.genres[0];
        expect(genre).toBeDefined();
        expect(typeof genre).toBe("string");
        expect(genre.length).toBeGreaterThan(0);
      }
    });
  });
}); 