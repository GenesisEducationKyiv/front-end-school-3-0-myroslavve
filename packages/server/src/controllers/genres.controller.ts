import { getGenres } from '../utils/db';
import { RouteHandler } from '../types';


/**
 * Get all available genres
 */
export const getAllGenres: RouteHandler = async (
  request,
  reply
) => {
  try {
    const genres = await getGenres();
    return reply.code(200).send(genres);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
};