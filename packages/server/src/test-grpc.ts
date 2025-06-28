import { createConnectTransport } from "@connectrpc/connect-node";
import { createClient } from "@connectrpc/connect";
import { TracksService, GenresService } from "@music-app/common";
import { create } from "@bufbuild/protobuf";
import { GetTracksRequestSchema, GetGenresRequestSchema } from "@music-app/common";

async function testGrpcServices() {
  console.log("🚀 Testing gRPC Services...");
  console.log("📡 Connecting to server at http://localhost:8000\n");

  const transport = createConnectTransport({
    httpVersion: "1.1",
    baseUrl: "http://localhost:8000",
  });

  const tracksClient = createClient(TracksService, transport);
  const genresClient = createClient(GenresService, transport);

  try {
    // Test Genres Service
    console.log("📁 Testing GenresService...");
    const genresRequest = create(GetGenresRequestSchema, {});
    const genresResponse = await genresClient.getGenres(genresRequest);
    
    console.log(`✅ Genres found: ${genresResponse.genres.length}`);
    console.log(`   Genres: ${genresResponse.genres.join(", ")}\n`);

    // Test Tracks Service
    console.log("🎵 Testing TracksService...");
    const tracksRequest = create(GetTracksRequestSchema, {
      queryParams: {
        page: 1,
        limit: 5,
      },
    });
    const tracksResponse = await tracksClient.getTracks(tracksRequest);
    
    console.log(`✅ Tracks found: ${tracksResponse.data.length}`);
    console.log(`   Total tracks: ${tracksResponse.meta?.total}`);
    console.log(`   Page: ${tracksResponse.meta?.page}, Limit: ${tracksResponse.meta?.limit}`);
    
    if (tracksResponse.data.length > 0) {
      console.log(`   First track: "${tracksResponse.data[0]?.title}" by ${tracksResponse.data[0]?.artist}`);
    }

    console.log("\n🎉 All gRPC services are working correctly!");

  } catch (error: any) {
    console.error("❌ Error testing gRPC services:");
    
    if (error.code === 14 || error.cause?.code === 'ECONNREFUSED') {
      console.log("\n💡 Connection refused - Server is not running!");
      console.log("   Please start the server first:");
      console.log("   1. Open another terminal");
      console.log("   2. Run: npm run dev");
      console.log("   3. Wait for 'Server listening on http://0.0.0.0:8000'");
      console.log("   4. Then run this test again");
    } else {
      console.log("   Error details:", error.message || error);
    }
    
    process.exit(1);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testGrpcServices();
} 