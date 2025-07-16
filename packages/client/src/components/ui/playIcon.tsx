import { Pause, Play } from "lucide-react";
import { Button } from "./button/button";

interface PlayButtonProps {
    isPlaying: boolean;
    backgroundImage: string;
    disabled: boolean;
    onClick?: () => void;
}

export default function PlayButton({ isPlaying, backgroundImage, disabled, onClick }: PlayButtonProps) {
    return (
        <div
            className="relative overflow-hidden bg-cover bg-center size-9 rounded-md"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
        >
            <Button
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                variant="ghost-hover"
                size="icon"
                disabled={disabled}
                aria-disabled={disabled}
                onClick={onClick}
            >
                {!disabled && (
                    isPlaying ? (
                        <Pause className="w-4 h-4" />
                    ) : (
                        <Play className="w-4 h-4" />
                    )
                )}
            </Button>
        </div>
    )
}
