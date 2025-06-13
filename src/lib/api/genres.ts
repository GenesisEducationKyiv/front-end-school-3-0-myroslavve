import { GenresSchema } from "./schemas";
import { apiFetch } from "./api-fetch";
import { ok } from "neverthrow";

let genresCache: string[] | null = null;

const getGenres = async () => {
    if (genresCache) {
        return ok(genresCache);
    }

    const validatedData = await apiFetch('/genres', {
        schema: GenresSchema
    });
    
    if (validatedData.isOk()) {
        genresCache = validatedData.value;
        return validatedData;
    }

    return validatedData;
}

export { getGenres };
