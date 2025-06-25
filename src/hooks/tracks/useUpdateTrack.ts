import { UpdateTrackDto } from "@/lib/api/schemas";
import { updateTrack } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUpdateTrack = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, track }: { id: string, track: UpdateTrackDto }) => 
            updateTrack(id, track),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Track updated successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to update track");
        },
    });
};

export default useUpdateTrack;