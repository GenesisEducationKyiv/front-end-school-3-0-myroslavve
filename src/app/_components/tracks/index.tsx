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
import { getTracks } from "@/lib/api/tracks";
import { debounce } from "@/lib/utils/input";
import { PaginatedResponse, Track } from "@/lib/api/schemas";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import AudioContext from "./audioContext";
import { columns } from "./table/trackColumns";
import { toast } from "sonner";
import useTracksQueryParams from "./hooks/useTracksQueryParams";

export function Tracks() {
    const [data, setData] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const playerRef = useRef<AudioPlayer>(null);
    const [tracksMeta, setTracksMeta] = useState<
      PaginatedResponse<Track>["meta"] | null
    >(null);
    const [genreOptions, setGenreOptions] = useState<string[]>(['All']);
    const totalTracks = tracksMeta?.total || 0;
    const totalPages = tracksMeta?.totalPages || 1;

    const {
    setParam,
    page,
    limit,
    sort,
    order,
    search,
    genre,
    } = useTracksQueryParams();

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

    const fetchTracks = useCallback(async () => {
        setIsLoading(true);
        const result = await getTracks({
            page,
            limit,
            sort,
            order,
            search: search || undefined,
            genre: 
                genre === "All" || !genreOptions.includes(genre) 
                ? undefined 
                : genre,
        });
        if (result.isOk()) {
            setData(result.value.data);
            setTracksMeta(result.value.meta);
        } else {
            toast.error("Failed to fetch tracks");
            console.error("Failed to fetch tracks:", result.error);
        }
        setIsLoading(false);
    }, [page, limit, sort, order, search, genre, genreOptions]);

    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

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
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="artist">Artist</SelectItem>
                                        <SelectItem value="album">Album</SelectItem>
                                        <SelectItem value="createdAt">Created At</SelectItem>
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
                                        <SelectItem value="asc">Ascending</SelectItem>
                                        <SelectItem value="desc">Descending</SelectItem>
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
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Input
                                placeholder="Search..."
                                defaultValue={search}
                                onChange={handleSearchInputChange}
                                data-testid="search-input"
                            />
                            <CreateEditModal updateData={fetchTracks} data-testid="create-track-button" />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={isLoading ? Array(limit).fill({}) : data}
                        updateData={fetchTracks}
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