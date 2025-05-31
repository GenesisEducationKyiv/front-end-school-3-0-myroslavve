"use client"

import { getGenres } from "@/lib/api/genres"
import { createTrack, updateTrack } from "@/lib/api/tracks"
import { isValidImageUrl } from "@/lib/utils"
import { Track } from "@/lib/api/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

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

interface CreateEditModalProps {
    track?: Track
    customButton?: React.ReactNode
    updateData: () => void
    onClose?: () => void
}

export default function CreateEditModal({ track, customButton, updateData, onClose }: CreateEditModalProps) {
    const isEdit = track !== undefined;
    const [availableGenres, setAvailableGenres] = useState<string[]>([]);
    const [isGenresLoading, setIsGenresLoading] = useState(false);

    const [open, setOpen] = useState(false)
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

    useEffect(() => {
        const loadGenres = async () => {
            setIsGenresLoading(true);
            try {
                const genres = await getGenres();
                setAvailableGenres(genres);
            } catch (error) {
                console.error("Failed to load genres:", error);
            } finally {
                setIsGenresLoading(false);
            }
        };

        loadGenres();
    }, []);

    const onSubmit = async (data: TrackFormValues) => {
        if (isEdit) {
            try {
                await updateTrack(track?.id, data)
                toast.success("Track updated successfully")
            } catch (error) {
                console.error("Failed to update track:", error)
                toast.error("Failed to update track")
            }
        } else {
            try {
                await createTrack(data)
                toast.success("Track created successfully")
            } catch (error) {
                console.error("Failed to create track:", error)
                toast.error("Failed to create track")
            }
        }

        updateData()
        closeModal()
    }

    const closeModal = () => {
        onOpenChange(false)
        form.reset()
    }

    const onOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            onClose?.()
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {customButton ?? <Button data-testid="create-track-button">{isEdit ? "Edit" : "Create"}</Button>}
            </DialogTrigger>
            <DialogContent aria-describedby="create-track-form">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit track" : "Create track"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Edit the track details" : "Create a new track"}
                    </DialogDescription>
                </DialogHeader>
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
                                                        ) : availableGenres
                                                            .filter(genre => !field.value.includes(genre))
                                                            .map((genre, index) => (
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
                                                            ))}
                                                        {!isGenresLoading && availableGenres.filter(genre => !field.value.includes(genre)).length === 0 && (
                                                            <p className="text-center py-2 text-muted-foreground">All genres selected</p>
                                                        )}
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
            </DialogContent>
        </Dialog>
    )
}