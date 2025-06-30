import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/lib/api/genres";
import { toast } from "sonner";

const useGenres = () => {
    const { data: genres, isLoading, error } = useQuery({
        queryKey: ["genres"],
        queryFn: async () => {
            const result = await getGenres();
            if (result.isOk()) {
                return result.value;
            } else {
                toast.error("Failed to fetch genres");
                throw new Error(result.error.message || "Failed to fetch genres");
            }
        },
    });

    return { genres, isLoading, error };
}

export default useGenres;