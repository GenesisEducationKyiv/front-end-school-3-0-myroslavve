"use client"

import { isValidImageUrl } from "@/lib/utils/image"
import { Track } from "@/lib/api/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import useGenres from "@/hooks/genres/useGenres"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import useCreateTrack from "@/hooks/tracks/useCreateTrack"
import useUpdateTrack from "@/hooks/tracks/useUpdateTrack"

const trackFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    artist: z.string().min(1, { message: "Artist is required" }),
    album: z.string().optional(),
    genres: z.array(z.string()),
    coverImage: z.string()
        .optional()
        .refine(
            (url) => !url || url === "" || isValidImageUrl(url),
            { message: "URL must be a valid image (jpg, jpeg, png, gif, webp, etc.)" }
        ),
})

type TrackFormValues = z.infer<typeof trackFormSchema>

interface CreateEditFormProps {
    track?: Track
    onClose: () => void
}

export default function CreateEditForm({ track, onClose }: CreateEditFormProps) {
    const isEdit = track !== undefined;
    const { genres = [], isLoading: isGenresLoading } = useGenres();
    
    const closeModal = () => {
        onClose()
        form.reset()
    }

    const { mutate: createTrack } = useCreateTrack(closeModal);
    const { mutate: updateTrack } = useUpdateTrack(closeModal);

    const form = useForm<TrackFormValues>({
        resolver: zodResolver(trackFormSchema),
        defaultValues: {
            title: track?.title ?? "",
            artist: track?.artist ?? "",
            album: track?.album ?? "",
            genres: track?.genres ?? [],
            coverImage: track?.coverImage ?? "",
        },
    })

    const onSubmit = async (data: TrackFormValues) => {
        if (isEdit) {
            updateTrack({ id: track.id, track: data })
        } else {
            createTrack(data)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="track-form">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title*</FormLabel>
                            <FormControl>
                                <Input placeholder="Track title" {...field} data-testid="input-title" />
                            </FormControl>
                            <FormMessage data-testid="error-title" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="artist"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Artist*</FormLabel>
                            <FormControl>
                                <Input placeholder="Artist name" {...field} data-testid="input-artist" />
                            </FormControl>
                            <FormMessage data-testid="error-artist" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="album"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Album</FormLabel>
                            <FormControl>
                                <Input placeholder="Album name" {...field} data-testid="input-album" />
                            </FormControl>
                            <FormMessage data-testid="error-album" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="genres"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Genres</FormLabel>
                            <FormControl>
                                <div className="flex flex-wrap gap-2" data-testid="genre-selector">
                                    {field.value.map((genre, index) => (
                                        <Badge
                                            key={index}
                                            className="px-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                                        >
                                            <span className="text-xs/loose">{genre}</span>
                                            <Button
                                                variant="ghost"
                                                size="iconSm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newGenres = [...field.value];
                                                    newGenres.splice(index, 1);
                                                    field.onChange(newGenres);
                                                }}
                                                className="ml-1 inline-flex items-center"
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        </Badge>
                                    ))}

                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Plus className="size-4 mr-1" /> Add Genre
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-60 p-2" align="start">
                                            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto overflow-x-hidden scrollbar-thin" onWheel={(e) => e.stopPropagation()}>
                                                {isGenresLoading ? (
                                                    <p className="text-center py-2">Loading genres...</p>
                                                ) : genres
                                                    .filter(genre => !field.value.includes(genre))
                                                    .map((genre, index) => (
                                                        <>
                                                            <Button
                                                                key={index}
                                                                variant="ghost"
                                                                className="justify-start font-normal"
                                                                onClick={() => {
                                                                    field.onChange([...field.value, genre]);
                                                                }}
                                                            >
                                                                {genre}
                                                            </Button>
                                                            {genres.filter(genre => !field.value.includes(genre)).length === 0 && (
                                                                <p className="text-center py-2 text-muted-foreground">All genres selected</p>
                                                            )}
                                                        </>
                                                    ))}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </FormControl>
                            <FormMessage data-testid="error-genres" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cover Image URL</FormLabel>
                            <FormControl>
                                <Input placeholder="URL to cover image" {...field} data-testid="input-cover-image" />
                            </FormControl>
                            <FormMessage data-testid="error-coverImage" />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-4" data-testid="submit-button">{isEdit ? "Update" : "Create"}</Button>
            </form>
        </Form>
    )
} 