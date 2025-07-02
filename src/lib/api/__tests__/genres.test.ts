import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getGenres, clearGenresCache } from '../genres';
import { API_URL } from '@/constants';
import { Err, Ok, Result } from 'neverthrow';

function assertOk<T, E>(result: Result<T, E>): asserts result is Ok<T, E> {
  expect(result.isOk()).toBe(true);
}

function assertErr<T, E>(result: Result<T, E>): asserts result is Err<T, E> {
  expect(result.isErr()).toBe(true);
}

const handlers = [
  http.get(`${API_URL}/genres`, () => {
    return HttpResponse.json([
      'Rock',
      'Jazz',
      'Classical',
      'Electronic',
      'Hip-Hop',
      'Pop'
    ])
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
  clearGenresCache();
});

afterAll(() => {
  server.close();
});

describe('getGenres Integration Tests', () => {
  it('should successfully fetch and return genres from the API', async () => {
    const result = await getGenres();
    
    assertOk(result);
    expect(result.value).toEqual([
      'Rock',
      'Jazz',
      'Classical',
      'Electronic',
      'Hip-Hop',
      'Pop'
    ]);
    expect(Array.isArray(result.value)).toBe(true);
    expect(result.value.length).toBeGreaterThan(0);
  });

  it('should return cached genres on subsequent calls', async () => {
    const firstResult = await getGenres();
    assertOk(firstResult);
    
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.json(['Different', 'Genres']);
      })
    );
    
    const secondResult = await getGenres();
    assertOk(secondResult);
    expect(secondResult.value).toEqual(firstResult.value);
    expect(secondResult.value).not.toEqual(['Different', 'Genres']);
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    const result = await getGenres();
    
    assertErr(result);
    expect(result.error.message).toContain('Internal server error');
  });

  it('should handle invalid response data', async () => {
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.json({ invalid: 'data' });
      })
    );

    const result = await getGenres();
    
    assertErr(result);
    expect(result.error.message).toContain('Expected array');
  });

  it('should handle network errors', async () => {
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.error();
      })
    );

    const result = await getGenres();
    
    assertErr(result);
    expect(result.error.message).toContain('Failed to fetch');
  });

  it('should handle empty genres array', async () => {
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.json([]);
      })
    );

    const result = await getGenres();
    
    assertOk(result);
    expect(result.value).toEqual([]);
  });
});