"use client"

import { Track } from "@/lib/api/schemas"
import { useState } from "react"
import { Button } from "../ui/button/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import dynamic from "next/dynamic"
import Spinner from "../ui/spinner/spinner"

const CreateEditForm = dynamic(() => import("./create-edit-form"), {
    loading: () => <Spinner />,
    ssr: false,
});

interface CreateEditModalProps {
    track?: Track
    customButton?: React.ReactNode
    onClose?: () => void
}

export default function CreateEditModal({ track, customButton, onClose }: CreateEditModalProps) {
    const isEdit = track !== undefined;
    const [open, setOpen] = useState(false)

    const onOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            onClose?.()
        }
    }

    const handleClose = () => {
        setOpen(false)
        onClose?.()
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
                {open && (
                    <CreateEditForm 
                        track={track} 
                        onClose={handleClose}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}