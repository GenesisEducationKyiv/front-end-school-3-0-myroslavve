import CreateEditModal from "@/components/create-edit-modal"
import { Button } from "@/components/ui/button/button"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdownMenu"
import { EllipsisIcon, UploadIcon } from "lucide-react"

import { DropdownMenu } from "@/components/ui/dropdownMenu"
import { Track } from "@/lib/api/schemas"
import { Row } from "@tanstack/react-table"
import { EditIcon } from "lucide-react"
import { useState } from "react"

import DeleteButton from "@/components/delete-button"
import UploadModal from "@/components/upload-modal"
import useUploadTrack from "@/hooks/tracks/useUploadTrack"
import useDeleteTrack from "@/hooks/tracks/useDeleteTrack"
import useDeleteTrackFile from "@/hooks/tracks/useDeleteTrackFile"

interface ActionCellProps {
    row: Row<Track>
    isLoading: boolean
}

export default function ActionCell({ row, isLoading }: ActionCellProps) {
    const [isOpen, setIsOpen] = useState(false)
    const closeModal = () => setIsOpen(false)
    const { mutate: deleteTrack } = useDeleteTrack(closeModal)
    const { mutate: uploadTrack } = useUploadTrack(closeModal)
    const { mutate: deleteTrackFile } = useDeleteTrackFile(closeModal)

    const handleUpload = async (file: File) => {
        uploadTrack({ id: row.original.id, file })
    }

    const handleDelete = async () => {
        deleteTrack(row.original.id)
    }

    const handleDeleteFile = async () => {
        deleteTrackFile(row.original.id)
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
                    } onClose={() => setIsOpen(false)} />
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