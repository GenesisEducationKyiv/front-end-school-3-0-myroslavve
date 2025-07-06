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
    const isCurrentTrackPlaying = currentTrack?.id === row.original.id && isPlaying;

    const handlePlay = () => {
        if (isCurrentTrackPlaying) {
            pause();
        } else {
            setCurrentTrack(row.original);
            play();
        }
    }

    return <PlayButton
        backgroundImage={row.original.coverImage || "/default.webp"}
        isPlaying={isCurrentTrackPlaying}
        disabled={isDisabled}
        onClick={handlePlay}
    />
}