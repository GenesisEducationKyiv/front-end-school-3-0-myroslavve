import { createTrack } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useCreateTrack = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTrack,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Track created successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to create track");
        },
    });
};

export default useCreateTrack;