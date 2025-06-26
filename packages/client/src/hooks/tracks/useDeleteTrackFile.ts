import { deleteTrackFile } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useDeleteTrackFile = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTrackFile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Track file deleted successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to delete track file");
        },
    });
};

export default useDeleteTrackFile;