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
import { debounce } from "@/lib/utils";
import { PaginatedResponse, Track } from "@/lib/api/schemas";
import { useCallback, useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import AudioContext from "./audioContext";
import { columns } from "./table/trackColumns";

export function Tracks() {
    const [data, setData] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const playerRef = useRef<AudioPlayer>(null);
    const [tracksMeta, setTracksMeta] = useState<PaginatedResponse<Track>['meta'] | null>(null);
    const totalTracks = tracksMeta?.total || 0;
    const totalPages = tracksMeta?.totalPages || 1;

    // Pagination and filtering state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState<'title' | 'artist' | 'album' | 'createdAt'>("createdAt");
    const [order, setOrder] = useState<'asc' | 'desc'>("desc");
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState<string>('All');
    const [genreOptions, setGenreOptions] = useState<string[]>(['All']);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const genres = await getGenres();
                setGenreOptions(['All', ...genres]);
            } catch (error) {
                console.error("Failed to fetch genres:", error);
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
        try {
            const result = await getTracks({
                page,
                limit,
                sort,
                order,
                search: search || undefined,
                genre: genre === 'All' ? undefined : genre,
            });
            setData(result.data);
            setTracksMeta(result.meta);
        } catch (error) {
            console.error("Failed to fetch tracks:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, sort, order, search, genre]);

    useEffect(() => {
        fetchTracks();
    }, [fetchTracks]);

    const handleSearchChange = debounce((value: string) => {
        setSearch(value);
    }, 300);

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
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
                                    onValueChange={(value) => setSort(value as 'title' | 'artist' | 'album' | 'createdAt')}
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
                                    onValueChange={(value) => setOrder(value as 'asc' | 'desc')}
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
                                    onValueChange={(value) => setLimit(Number(value))}
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
                                onChange={(e) => handleSearchChange(e.target.value)}
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
                        setFilter={setGenre}
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