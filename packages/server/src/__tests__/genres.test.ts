import { describe, it, expect } from 'vitest';
import { setupTestServer } from './helpers/server';

describe('Genres Endpoints', () => {
  const getServer = setupTestServer();
  
  describe('GET /api/genres', () => {
    it('should return all genres', async () => {
      const response = await getServer().inject({
        method: 'GET',
        url: '/api/genres'
      });
      
      expect(response.statusCode).toBe(200);
      const genres = JSON.parse(response.payload);
      
      expect(Array.isArray(genres)).toBe(true);
      expect(genres.length).toBeGreaterThan(0);
      expect(genres).toContain('Rock');
      expect(genres).toContain('Pop');
      expect(genres).toContain('Jazz');
    });
  });
});