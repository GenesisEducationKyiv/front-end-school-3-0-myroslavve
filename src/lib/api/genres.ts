import { GenresSchema } from "./schemas";
import { apiFetch } from "./api-fetch";

let genresCache: string[] | null = null;

const getGenres = async () => {
    if (genresCache) {
        return genresCache;
    }

    const validatedData = await apiFetch('/genres', {
        schema: GenresSchema
    });
    
    genresCache = validatedData;
    return validatedData;
}

export { getGenres };
