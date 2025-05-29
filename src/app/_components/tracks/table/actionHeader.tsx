import { DropdownMenuItem } from "@/components/ui/dropdownMenu"

import { EllipsisIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import DeleteButton from "@/components/delete-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdownMenu"
import { deleteTracks } from "@/lib/api/tracks"
import { Track } from "@/types"
import { Row } from "@tanstack/react-table"
import { useState } from "react"
import { toast } from "sonner"

interface ActionHeaderProps {
    rows: Row<Track>[]
    updateData: () => void
    removeSelectionRows: () => void
    isLoading: boolean
}

export default function ActionHeader({ rows, updateData, removeSelectionRows, isLoading }: ActionHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        try {
            await deleteTracks(rows.map(row => row.original.id))
            setIsOpen(false)
            await updateData()
            removeSelectionRows()
            toast.success("Tracks deleted successfully")
        } catch (error) {
            console.error("Failed to delete tracks:", error)
            toast.error("Failed to delete tracks")
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
                    <DeleteButton
                        buttonText="Delete selected"
                        onDelete={handleDelete}
                        data-testid="bulk-delete-button" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}