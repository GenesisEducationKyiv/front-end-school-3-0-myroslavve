import { describe, it, expect } from 'vitest';
import { setupTestServer } from './helpers/server';

describe('Health Check Endpoint', () => {
  const getServer = setupTestServer();
  
  it('GET /health should return 200 and status ok', async () => {
    const response = await getServer().inject({
      method: 'GET',
      url: '/health'
    });
    
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: 'ok' });
  });
});