import { deleteTrack } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteTrack = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Track deleted successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to delete track");
        },
    });
};

export default useDeleteTrack;