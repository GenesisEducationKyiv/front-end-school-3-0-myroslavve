import { API_URL } from "@/constants";

let genresCache: string[] | null = null;

const getGenres = async () => {
    if (genresCache) {
        return genresCache;
    }

    const response = await fetch(`${API_URL}/genres`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to fetch genres");
    }

    genresCache = data;
    return data;
}

export { getGenres };
