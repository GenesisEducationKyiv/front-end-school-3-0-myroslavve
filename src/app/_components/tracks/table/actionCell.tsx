import CreateEditModal from "@/components/create-edit-modal"
import { Button } from "@/components/ui/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu"
import { EllipsisIcon, UploadIcon } from "lucide-react"

import { DropdownMenu } from "@/components/ui/dropdownMenu"
import { deleteTrack, deleteTrackFile, uploadTrack } from "@/lib/api/tracks"
import { Track } from "@/lib/api/schemas"
import { Row } from "@tanstack/react-table"
import { EditIcon } from "lucide-react"
import { useState } from "react"

import DeleteButton from "@/components/delete-button"
import UploadModal from "@/components/upload-modal"
import { toast } from "sonner"

interface ActionCellProps {
    row: Row<Track>
    updateData: () => void
    isLoading: boolean
}

export default function ActionCell({ row, updateData, isLoading }: ActionCellProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleUpload = async (file: File) => {
        const result = await uploadTrack(row.original.id, file)
        if (result.isOk()) {
            setIsOpen(false)
            toast.success("Track uploaded successfully")
            await updateData()
        } else {
            console.error("Failed to upload track:", result.error)
            toast.error("Failed to upload track")
        }
    }

    const handleDelete = async () => {
        const result = await deleteTrack(row.original.id)
        if (result.isOk()) {
            setIsOpen(false)
            toast.success("Track deleted successfully")
            await updateData()
        } else {
            console.error("Failed to delete track:", result.error)
            toast.error("Failed to delete track")
        }
    }

    const handleDeleteFile = async () => {
        const result = await deleteTrackFile(row.original.id)
        if (result.isOk()) {
            toast.success("Track file deleted successfully")
            await updateData()
        } else {
            console.error("Failed to delete track file:", result.error)
            toast.error("Failed to delete track file")
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isLoading}>
                    <EllipsisIcon className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit flex flex-col gap-2">
                <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault() }}>
                    <UploadModal customButton={
                        <Button
                            variant="ghost"
                            className="justify-start"
                            data-testid={`upload-track-${row.original.id}`}
                        >
                            <UploadIcon className="w-4 h-4" />
                            Upload
                        </Button>
                    } onUpload={handleUpload} onDelete={handleDeleteFile} uploaded={row.original.audioFile ?? ""} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault() }}>
                    <CreateEditModal track={row.original} customButton={
                        <Button
                            variant="ghost"
                            className="justify-start"
                            data-testid={`edit-track-${row.original.id}`}
                        >
                            <EditIcon className="w-4 h-4" />
                            Edit
                        </Button>
                    } updateData={updateData} onClose={() => setIsOpen(false)} />
                </DropdownMenuItem>
                <DropdownMenuItem asChild onSelect={(e) => { e.preventDefault() }}>
                    <DeleteButton
                        buttonText="Delete"
                        onDelete={handleDelete}
                        data-testid={`delete-track-${row.original.id}`} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}