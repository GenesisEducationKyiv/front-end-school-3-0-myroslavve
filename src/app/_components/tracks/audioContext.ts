import { Track } from "@/types";
import { createContext } from "react";

type AudioContextType = {
    track: Track | null;
    setTrack: (track: Track) => void;
    pause: () => void;
    play: () => void;
}

const AudioContext = createContext<AudioContextType>({
    track: null,
    setTrack: () => { },
    pause: () => { },
    play: () => { },
})

export default AudioContext;