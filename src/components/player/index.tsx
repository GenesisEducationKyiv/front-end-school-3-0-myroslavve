import { cn } from "@/lib/utils/tailwind-utils";
import { ArrowLeftIcon, ArrowRightIcon, PauseIcon, PlayIcon, RepeatIcon, RotateCcwIcon, RotateCwIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import './index.css';
import { useEffect } from "react";

interface PlayerProps {
    id: string;
    src: string;
    playerRef: React.RefObject<AudioPlayer | null>;
    hidden?: boolean;
    isPlaying: boolean;
    setIsPlaying: (isPlaying: boolean) => void;
    title: string;
    artist: string;
    cover: string;
}

export default function Player({ id, src, playerRef, hidden, isPlaying, setIsPlaying, title, artist, cover }: PlayerProps) {
    const hasMetadata = title && artist && cover;

    useEffect(() => {
        if (isPlaying) {
            playerRef.current?.audio.current?.play();
        } else {
            playerRef.current?.audio.current?.pause();
        }
    }, [isPlaying, playerRef]);

    return (
        <div className={cn("rounded-lg border-1 border-border overflow-hidden", hidden && "hidden")} data-testid={`audio-player-${id}`}>
            {hasMetadata && (
                <div className="flex items-center gap-2 py-2 px-4 bg-background">
                    <Image src={cover} alt={title} className="w-10 h-10 rounded-md" width={40} height={40} />
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">{title}</p>
                        <p className="text-xs text-muted-foreground">{artist}</p>
                    </div>
                </div>
            )}
            <AudioPlayer
                ref={playerRef}
                src={src}
                autoPlay={true}
                className="audio-player bg-background"
                onPlay={() => {
                    setIsPlaying(true)
                }}
                onPause={() => {
                    setIsPlaying(false)
                }}
                customIcons={{
                    play: <PlayIcon className="text-foreground" data-testid={`play-button-${id}`} />,
                    pause: <PauseIcon className="text-foreground" data-testid={`pause-button-${id}`} />,
                    previous: <ArrowLeftIcon className="text-foreground" />,
                    next: <ArrowRightIcon className="text-foreground" />,
                    rewind: <RotateCcwIcon className="text-foreground" />,
                    forward: <RotateCwIcon className="text-foreground" />,
                    volume: <Volume2Icon className="text-foreground hidden md:block" />,
                    volumeMute: <VolumeXIcon className="text-foreground hidden md:block" />,
                    loop: <RepeatIcon className="text-foreground" />,
                    loopOff: <RepeatIcon className="text-muted-foreground" />,
                }}
                progressJumpSteps={{ backward: 5000, forward: 5000 }}
                volumeJumpStep={0.1}
            />
        </div>
    )
}