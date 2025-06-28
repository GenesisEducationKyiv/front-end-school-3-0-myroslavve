import { FastifyInstance } from 'fastify';
import { 
  addTrack, 
  deleteTrackFile, 
  getAllTracks, 
  getTrack, 
  removeTrack, 
  removeTracks, 
  updateTrackById, 
  uploadTrackFile 
} from './controllers/tracks.controller';
import { getAllGenres } from './controllers/genres.controller';

export default async function routes(fastify: FastifyInstance) {
  // Define schemas for routes
  const trackSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      artist: { type: 'string' },
      album: { type: 'string' },
      genres: { 
        type: 'array',
        items: { type: 'string' }
      },
      slug: { type: 'string' },
      coverImage: { type: 'string' },
      audioFile: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' }
    }
  };
  
  const errorSchema = {
    type: 'object',
    properties: {
      error: { type: 'string' }
    }
  };
  
  // Health check
  fastify.get('/health', {
    schema: {
      description: 'Health check endpoint',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      }
    },
    handler: async (request, reply) => {
      return reply.code(200).send({ status: 'ok' });
    }
  });
  
  // Genres
  fastify.get('/api/genres', {
    schema: {
      description: 'Get all genres',
      tags: ['genres'],
      response: {
        200: {
          type: 'array',
          items: { type: 'string' }
        },
        500: errorSchema
      }
    },
    handler: getAllGenres
  });
  
  // Tracks
  fastify.get('/api/tracks', {
    schema: {
      description: 'Get all tracks with pagination, sorting, and filtering',
      tags: ['tracks'],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number' },
          limit: { type: 'number' },
          sort: { type: 'string', enum: ['title', 'artist', 'album', 'createdAt'] },
          order: { type: 'string', enum: ['asc', 'desc'] },
          search: { type: 'string' },
          genre: { type: 'string' },
          artist: { type: 'string' }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: trackSchema
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'number' },
                page: { type: 'number' },
                limit: { type: 'number' },
                totalPages: { type: 'number' }
              }
            }
          }
        },
        500: errorSchema
      }
    },
    handler: getAllTracks
  });
  
  fastify.get('/api/tracks/:slug', {
    schema: {
      description: 'Get a track by slug',
      tags: ['tracks'],
      params: {
        type: 'object',
        required: ['slug'],
        properties: {
          slug: { type: 'string' }
        }
      },
      response: {
        200: trackSchema,
        404: errorSchema,
        500: errorSchema
      }
    },
    handler: getTrack
  });
  
  fastify.post('/api/tracks', {
    schema: {
      description: 'Create a new track',
      tags: ['tracks'],
      body: {
        type: 'object',
        required: ['title', 'artist', 'genres'],
        properties: {
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          genres: { 
            type: 'array',
            items: { type: 'string' }
          },
          coverImage: { type: 'string' }
        }
      },
      response: {
        201: trackSchema,
        400: errorSchema,
        409: errorSchema,
        500: errorSchema
      }
    },
    handler: addTrack
  });
  
  fastify.put('/api/tracks/:id', {
    schema: {
      description: 'Update a track',
      tags: ['tracks'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          artist: { type: 'string' },
          album: { type: 'string' },
          genres: { 
            type: 'array',
            items: { type: 'string' }
          },
          coverImage: { type: 'string' }
        }
      },
      response: {
        200: trackSchema,
        404: errorSchema,
        409: errorSchema,
        500: errorSchema
      }
    },
    handler: updateTrackById
  });
  
  fastify.delete('/api/tracks/:id', {
    schema: {
      description: 'Delete a track',
      tags: ['tracks'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: {
          type: 'null',
          description: 'Track deleted successfully'
        },
        404: errorSchema,
        500: errorSchema
      }
    },
    handler: removeTrack
  });
  
  fastify.post('/api/tracks/delete', {
    schema: {
      description: 'Delete multiple tracks',
      tags: ['tracks'],
      body: {
        type: 'object',
        required: ['ids'],
        properties: {
          ids: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: {
              type: 'array',
              items: { type: 'string' }
            },
            failed: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        400: errorSchema,
        500: errorSchema
      }
    },
    handler: removeTracks
  });
  
  // Track files
  fastify.post('/api/tracks/:id/upload', {
    schema: {
      description: 'Upload an audio file for a track',
      tags: ['tracks'],
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: trackSchema,
        400: errorSchema,
        404: errorSchema,
        500: errorSchema
      }
    },
    handler: uploadTrackFile
  });
  
  fastify.delete('/api/tracks/:id/file', {
    schema: {
      description: 'Delete an audio file from a track',
      tags: ['tracks'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: trackSchema,
        404: errorSchema,
        500: errorSchema
      }
    },
    handler: deleteTrackFile
  });
}