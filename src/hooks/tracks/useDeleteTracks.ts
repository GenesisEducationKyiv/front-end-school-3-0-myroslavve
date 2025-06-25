import { deleteTracks } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteTracks = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTracks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Tracks deleted successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to delete tracks");
        },
    });
};

export default useDeleteTracks;