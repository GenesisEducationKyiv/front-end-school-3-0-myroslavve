import { DropdownMenuItem } from "@/components/ui/dropdownMenu"

import { EllipsisIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import DeleteButton from "@/components/delete-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdownMenu"
import { Track } from "@/lib/api/schemas"
import { Row } from "@tanstack/react-table"
import { useState } from "react"
import useDeleteTracks from "@/hooks/tracks/useDeleteTracks"

interface ActionHeaderProps {
    rows: Row<Track>[]
    removeSelectionRows: () => void
    isLoading: boolean
}

export default function ActionHeader({ rows, removeSelectionRows, isLoading }: ActionHeaderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { mutate: deleteTracks } = useDeleteTracks(() => {
        setIsOpen(false)
        removeSelectionRows()
    })

    const handleDelete = async () => {
        deleteTracks(rows.map(row => row.original.id))
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