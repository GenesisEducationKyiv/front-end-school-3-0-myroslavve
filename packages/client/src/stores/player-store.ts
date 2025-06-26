import { Track } from "@/lib/api/schemas";
import { create } from "zustand";

interface PlayerStore {
    currentTrack: Track | null;
    setCurrentTrack: (track: Track) => void;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    pause: () => void;
    play: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
    (set) => ({
        isPlaying: false,
        currentTrack: null,
        setCurrentTrack: (track) => set({ currentTrack: track }),
        setIsPlaying: (isPlaying) => set({ isPlaying }),
        pause: () => set({ isPlaying: false }),
        play: () => set({ isPlaying: true }),
    })
);