import PlayButton from "@/components/ui/playIcon";
import { Track } from "@/lib/api/schemas";
import { Row } from "@tanstack/react-table";
import { usePlayerStore } from "@/stores/player-store";

interface PlayCellProps {
    row: Row<Track>
    isLoading: boolean
}

export default function PlayCell({ row, isLoading }: PlayCellProps) {
    const { currentTrack, setCurrentTrack, play, pause, isPlaying } = usePlayerStore();
    const isDisabled = isLoading || row.original.audioFile == null;

    return <PlayButton
        backgroundImage={row.original.coverImage || "/default.png"}
        isPlaying={(currentTrack?.id === row.original.id && isPlaying) ?? false}
        disabled={isDisabled}
        onClick={() => {
            if (currentTrack?.id === row.original.id) {
                if (isPlaying) {
                    pause();
                } else {
                    play();
                }
            } else {
                setCurrentTrack(row.original);
            }
        }}
    />
}