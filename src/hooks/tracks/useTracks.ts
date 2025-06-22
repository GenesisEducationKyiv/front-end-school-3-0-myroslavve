import { getTracks } from "@/lib/api/tracks";
import { useQuery } from "@tanstack/react-query";
import useTracksQueryParams from "../../app/_components/tracks/hooks/useTracksQueryParams";
import { toast } from "sonner";

const useTracks = (genreOptions: string[] = ['All']) => {
    const { page, limit, sort, order, search, genre } = useTracksQueryParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ["tracks", page, limit, sort, order, search, genre],
        queryFn: async () => {
            const result = await getTracks({ 
                page, 
                limit, 
                sort, 
                order, 
                search: search || undefined, 
                genre: genreOptions.includes(genre) && genre !== "All" ? genre : undefined 
            });
            
            if (result.isOk()) {
                return result.value;
            } else {
                toast.error("Failed to fetch tracks");
                throw new Error(result.error.message || "Failed to fetch tracks");
            }
        },
    });

    return { 
        tracks: data?.data || [], 
        tracksMeta: data?.meta || null, 
        isLoading, 
        error,
    };
};

export default useTracks;