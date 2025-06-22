import { uploadTrack } from "@/lib/api/tracks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const useUploadTrack = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, file }: { id: string, file: File }) => 
            uploadTrack(id, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tracks"] })
            toast.success("Track uploaded successfully");

            onSuccess?.()
        },
        onError: () => {
            toast.error("Failed to upload track");
        },
    });
};

export default useUploadTrack;