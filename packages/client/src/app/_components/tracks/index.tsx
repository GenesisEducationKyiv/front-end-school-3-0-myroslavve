"use client"

import CreateEditModal from "@/components/create-edit-modal";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STORAGE_URL } from "@/constants";
import { useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import { columns } from "./table/trackColumns";
import useTracksQueryParams from "./hooks/useTracksQueryParams";
import useTracks from "../../../hooks/tracks/useTracks";
import useGenres from "../../../hooks/genres/useGenres";
import { useQueryClient } from "@tanstack/react-query";
import { usePlayerStore } from "@/stores/player-store";
import dynamic from "next/dynamic";
import Spinner from "@/components/ui/spinner";

const Player = dynamic(() => import("@/components/player"), {
    loading: () => <Spinner />,
});

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
    const playerRef = useRef<AudioPlayer>(null);
    const {
        currentTrack,
        isPlaying,
        setIsPlaying,
    } = usePlayerStore();
    
    const { genres = [] } = useGenres();
    const genreOptions = ['All', ...genres];
    const { tracks: data, tracksMeta, isLoading } = useTracks(genreOptions);
    
    const totalTracks = tracksMeta?.total || 0;
    const totalPages = tracksMeta?.totalPages || 1;

    const {
        page,
        limit,
        sort,
        order,
        search,
        setSearch,
        setGenre,
        setSort,
        setOrder,
        setLimit,
        prevPage,
        nextPage,
    } = useTracksQueryParams();

    const updateTracks = () => queryClient.invalidateQueries({ queryKey: ["tracks"] });
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
    const currentPageTracksStart = data.length > 0 ? (page - 1) * limit + 1 : 0;
    const currentPageTracksEnd = Math.min(page * limit, totalTracks);

    return (
        <>
                <div className="w-full">
                    <div className="flex items-center justify-between py-4">
                        <h2 className="text-xl font-semibold" data-testid="tracks-header">Tracks</h2>
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center gap-2">
                                <Label className="text-nowrap">Sort by:</Label>
                                <Select
                                    value={sort}
                                    onValueChange={setSort}
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
                                    onValueChange={setOrder}
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
                                    onValueChange={setLimit}
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
                            <CreateEditModal data-testid="create-track-button" />
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={isLoading ? Array(limit).fill({}) : data}
                        updateData={updateTracks}
                        isLoading={isLoading}
                        setFilter={setGenre}
                        filterOptions={genreOptions}
                    />

                    <div className="flex items-center justify-between mt-4" data-testid="pagination">
                        <div className="text-sm text-muted-foreground">
                            Showing {currentPageTracksStart} to {currentPageTracksEnd} of {totalTracks} tracks
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={prevPage}
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
                                onClick={nextPage}
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
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        title={currentTrack?.title || ""}
                        artist={currentTrack?.artist || ""}
                        cover={currentTrack?.coverImage || ""}
                    />
                </div>
        </>
    );
} 