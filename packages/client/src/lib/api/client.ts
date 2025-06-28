import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { TracksService, GenresService } from "@music-app/common";
import { API_URL } from "@/constants";

const transport = createConnectTransport({
  baseUrl: API_URL,
});

export const tracksClient = createClient(TracksService, transport);
export const genresClient = createClient(GenresService, transport); 