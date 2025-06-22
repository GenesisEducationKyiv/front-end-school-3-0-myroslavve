"use client"

import CreateEditModal from "@/components/create-edit-modal";
import DataTable from "@/components/data-table";
import Player from "@/components/player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STORAGE_URL } from "@/constants";
import { getGenres } from "@/lib/api/genres";
import { debounce } from "@/lib/utils/input";
import { Track } from "@/lib/api/schemas";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import AudioContext from "./audioContext";
import { columns } from "./table/trackColumns";
import { toast } from "sonner";
import useTracksQueryParams from "./hooks/useTracksQueryParams";
import useTracks from "./hooks/useTracks";
import { useQueryClient } from "@tanstack/react-query";

const LIMIT_OPTIONS = [5, 10, 20, 50];
const SORT_OPTIONS = [
    { value: "title", label: "Title" },
    { value: "artist", label: "Artist" },
    { value: "album", label: "Album" },
    { value: "createdAt", label: "Created At" },
];
const ORDER_OPTIONS = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
];

export function Tracks() {
    const queryClient = useQueryClient();
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const playerRef = useRef<AudioPlayer>(null);
    const [genreOptions, setGenreOptions] = useState<string[]>(['All']);

    const {
        setParam,
        page,
        limit,
        sort,
        order,
        search,
    } = useTracksQueryParams();

    const { tracks: data, tracksMeta, isLoading } = useTracks(genreOptions);
    
    const totalTracks = tracksMeta?.total || 0;
    const totalPages = tracksMeta?.totalPages || 1;

    const updateTracks = () => queryClient.invalidateQueries({ queryKey: ["tracks"] });
    const handleSortChange = (value: string) => setParam("sort", value);
    const handleOrderChange = (value: string) => setParam("order", value);
    const handleLimitChange = (value: string) => setParam("limit", value);
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value);
    const handleGenreFilterChange = (filter: string) => setParam("genre", filter);

    useEffect(() => {
        const fetchGenres = async () => {
            const genres = await getGenres();
            if (genres.isOk()) {
                setGenreOptions(['All', ...genres.value]);
            } else {
                toast.error("Failed to fetch genres");
                console.error("Failed to fetch genres:", genres.error);
            }
        };

        fetchGenres();
    }, []);

    const pause = () => {
        if (currentTrack) {
            setCurrentTrack({ ...currentTrack, isPlaying: false });
        }
        playerRef.current?.audio.current?.pause();
    };

    const play = () => {
        if (currentTrack) {
            setCurrentTrack({ ...currentTrack, isPlaying: true });
        }
        playerRef.current?.audio.current?.play();
    };

    const handleSearchChange = debounce((value: string) => {
        setParam("search", value);
    }, 300);

    const handlePrevPage = () => {
        if (page > 1) {
            setParam("page", (page - 1).toString());
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setParam("page", (page + 1).toString());
        }
    };

    const handlePlayingChange = useCallback((isPlaying: boolean) => {
        if (currentTrack && currentTrack.isPlaying !== isPlaying) {
            setCurrentTrack(prev => prev ? { ...prev, isPlaying } : null);
        }
    }, [currentTrack]);

    return (
        <>
            <AudioContext.Provider value={{ track: currentTrack, setTrack: setCurrentTrack, pause, play }}>
                <div className="w-full">
                    <div className="flex items-center justify-between py-4">
                        <h2 className="text-xl font-semibold" data-testid="tracks-header">Tracks</h2>
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center gap-2">
                                <Label className="text-nowrap">Sort by:</Label>
                                <Select
                                    value={sort}
                                    onValueChange={handleSortChange}
                                    data-testid="sort-select"
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sort by:" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SORT_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-nowrap">Order:</Label>
                                <Select
                                    value={order}
                                    onValueChange={handleOrderChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Order:" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ORDER_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center gap-2">
                                <Label className="text-nowrap">Items per page:</Label>
                                <Select
                                    value={limit.toString()}
                                    onValueChange={handleLimitChange}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Items per page:" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LIMIT_OPTIONS.map((option) => (
                                            <SelectItem key={option} value={option.toString()}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Input
                                placeholder="Search..."
                                defaultValue={search}
                                onChange={handleSearchInputChange}
                                data-testid="search-input"
                            />
                            <CreateEditModal updateData={updateTracks} data-testid="create-track-button" />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={isLoading ? Array(limit).fill({}) : data}
                        updateData={updateTracks}
                        isLoading={isLoading}
                        setFilter={handleGenreFilterChange}
                        filterOptions={genreOptions}
                    />

                    <div className="flex items-center justify-between mt-4" data-testid="pagination">
                        <div className="text-sm text-muted-foreground">
                            Showing {data.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalTracks)} of {totalTracks} tracks
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={handlePrevPage}
                                disabled={page <= 1}
                                data-testid="pagination-prev"
                            >
                                Previous
                            </Button>
                            <div className="text-sm">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={page >= totalPages}
                                data-testid="pagination-next"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 fixed bottom-2 left-1/2 -translate-x-1/2">
                    <Player
                        id={currentTrack?.id || ""}
                        src={`${STORAGE_URL}/${currentTrack?.audioFile}`}
                        playerRef={playerRef}
                        hidden={currentTrack == null}
                        setIsPlaying={handlePlayingChange}
                        title={currentTrack?.title || ""}
                        artist={currentTrack?.artist || ""}
                        cover={currentTrack?.coverImage || ""}
                    />
                </div>
            </AudioContext.Provider>
        </>
    );
} 