import PlayButton from "@/components/ui/playIcon";
import { Track } from "@/types";
import { Row } from "@tanstack/react-table";
import { useContext } from "react";
import AudioContext from "../audioContext";

interface PlayCellProps {
    row: Row<Track>
    isLoading: boolean
}

export default function PlayCell({ row, isLoading }: PlayCellProps) {
    const { track, setTrack, play, pause } = useContext(AudioContext);
    const isDisabled = isLoading || row.original.audioFile == null;

    return <PlayButton
        backgroundImage={row.original.coverImage || "/default.png"}
        isPlaying={(track?.id === row.original.id && track?.isPlaying) ?? false}
        disabled={isDisabled}
        onClick={() => {
            if (track?.id === row.original.id) {
                if (track.isPlaying) {
                    pause();
                } else {
                    play();
                }
            } else {
                setTrack({ ...row.original, isPlaying: true });
            }
        }}
    />
}