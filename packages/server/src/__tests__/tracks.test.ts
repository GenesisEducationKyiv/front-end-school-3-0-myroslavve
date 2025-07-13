import { describe, it, expect, beforeAll } from 'vitest';
import { setupTestServer } from './helpers/server';

describe('Tracks Endpoints', () => {
  const getServer = setupTestServer();
  let testTrackId: string;
  const testTrack = {
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    genres: ['Rock', 'Pop'],
    coverImage: 'https://example.com/image.jpg'
  };
  
  describe('POST /api/tracks', () => {
    it('should create a new track', async () => {
      const response = await getServer().inject({
        method: 'POST',
        url: '/api/tracks',
        payload: testTrack
      });
      
      expect(response.statusCode).toBe(201);
      
      const createdTrack = JSON.parse(response.payload);
      testTrackId = createdTrack.id;
      
      expect(createdTrack.title).toBe(testTrack.title);
      expect(createdTrack.artist).toBe(testTrack.artist);
      expect(createdTrack.album).toBe(testTrack.album);
      expect(createdTrack.genres).toEqual(testTrack.genres);
      expect(createdTrack.slug).toBe('test-track');
      expect(createdTrack.coverImage).toBe(testTrack.coverImage);
      expect(createdTrack.id).toBeDefined();
      expect(createdTrack.createdAt).toBeDefined();
      expect(createdTrack.updatedAt).toBeDefined();
    });
    
    it('should return 400 when required fields are missing', async () => {
      const response = await getServer().inject({
        method: 'POST',
        url: '/api/tracks',
        payload: {
          title: 'Test Track'
          // Missing required fields
        }
      });
      
      expect(response.statusCode).toBe(400);
    });
  });
  
  describe('GET /api/tracks', () => {
    it('should return a list of tracks with pagination', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: '/api/tracks?page=1&limit=10'
      });
      
      expect(response.statusCode).toBe(200);
      
      const result = JSON.parse(response.payload);
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.meta).toBeDefined();
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.total).toBeGreaterThanOrEqual(1);
      expect(result.meta.totalPages).toBeGreaterThanOrEqual(1);
      
      // Verify our test track is in the results
      const testTrackInResults = result.data.some(
        (track: any) => track.title === testTrack.title
      );
      expect(testTrackInResults).toBe(true);
    });
    
    it('should filter tracks by search term', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: `/api/tracks?search=${testTrack.title}`
      });
      
      expect(response.statusCode).toBe(200);
      
      const result = JSON.parse(response.payload);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].title).toBe(testTrack.title);
    });
    
    it('should sort tracks by title', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: '/api/tracks?sort=title&order=asc'
      });
      
      expect(response.statusCode).toBe(200);
      
      const result = JSON.parse(response.payload);
      expect(result.data.length).toBeGreaterThan(0);
      
      // Verify the result is sorted by title
      const sortedTitles = [...result.data].map(track => track.title).sort();
      const resultTitles = result.data.map((track: any) => track.title);
      expect(resultTitles).toEqual(sortedTitles);
    });
  });
  
  describe('GET /api/tracks/:slug', () => {
    it('should return a track by slug', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: '/api/tracks/test-track'
      });
      
      expect(response.statusCode).toBe(200);
      
      const track = JSON.parse(response.payload);
      expect(track.title).toBe(testTrack.title);
      expect(track.artist).toBe(testTrack.artist);
      expect(track.slug).toBe('test-track');
    });
    
    it('should return 404 for non-existent track', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: '/api/tracks/non-existent-track'
      });
      
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('PUT /api/tracks/:id', () => {
    it('should update a track', async () => {
      const updatedData = {
        title: 'Updated Track',
        artist: 'Updated Artist',
        genres: ['Jazz', 'Blues']
      };
      
      const response = await getServer().inject({
        method: 'PUT',
        url: `/api/tracks/${testTrackId}`,
        payload: updatedData
      });
      
      expect(response.statusCode).toBe(200);
      
      const updatedTrack = JSON.parse(response.payload);
      expect(updatedTrack.title).toBe(updatedData.title);
      expect(updatedTrack.artist).toBe(updatedData.artist);
      expect(updatedTrack.genres).toEqual(updatedData.genres);
      expect(updatedTrack.slug).toBe('updated-track');
      expect(updatedTrack.album).toBe(testTrack.album); // This shouldn't change
    });
    
    it('should return 404 for non-existent track', async () => {
      const response = await getServer().inject({
        method: 'PUT',
        url: '/api/tracks/non-existent-id',
        payload: { title: 'Updated Track' }
      });
      
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('DELETE /api/tracks/:id', () => {
    it('should delete a track', async () => {
      const response = await getServer().inject({
        method: 'DELETE',
        url: `/api/tracks/${testTrackId}`
      });
      
      expect(response.statusCode).toBe(204);
      
      // Verify the track was deleted
      const getResponse = await getServer().inject({
        method: 'GET',
        url: '/api/tracks/updated-track'
      });
      
      expect(getResponse.statusCode).toBe(404);
    });
    
    it('should return 404 for non-existent track', async () => {
      const response = await getServer().inject({
        method: 'DELETE',
        url: '/api/tracks/non-existent-id'
      });
      
      expect(response.statusCode).toBe(404);
    });
  });
  
  describe('POST /api/tracks/delete', () => {
    let batchTrackIds: string[] = [];
    
    beforeAll(async () => {
      // Create multiple tracks for batch delete test
      for (let i = 0; i < 3; i++) {
        const response = await getServer().inject({
          method: 'POST',
          url: '/api/tracks',
          payload: {
            title: `Batch Track ${i}`,
            artist: 'Batch Artist',
            genres: ['Rock']
          }
        });
        
        const track = JSON.parse(response.payload);
        batchTrackIds.push(track.id);
      }
    });
    
    it('should delete multiple tracks', async () => {
      const response = await getServer().inject({
        method: 'POST',
        url: '/api/tracks/delete',
        payload: { ids: batchTrackIds }
      });
      
      expect(response.statusCode).toBe(200);
      
      const result = JSON.parse(response.payload);
      expect(result.success).toEqual(batchTrackIds);
      expect(result.failed).toEqual([]);
      
      // Verify all tracks were deleted
      for (const id of batchTrackIds) {
        const getResponse = await getServer().inject({
          method: 'GET',
          url: `/api/tracks/${id}`
        });
        
        expect(getResponse.statusCode).toBe(404);
      }
    });
    
    it('should return 400 for missing ids', async () => {
      const response = await getServer().inject({
        method: 'POST',
        url: '/api/tracks/delete',
        payload: {}
      });
      
      expect(response.statusCode).toBe(400);
    });
  });
});