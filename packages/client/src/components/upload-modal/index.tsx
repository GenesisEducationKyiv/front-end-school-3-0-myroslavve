import { useState } from "react"
import { Button } from "../ui/button/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import dynamic from "next/dynamic"
import Spinner from "../ui/spinner/spinner"

const UploadForm = dynamic(() => import("./upload-form"), {
    loading: () => <Spinner />,
    ssr: false,
});

interface UploadModalProps {
    customButton?: React.ReactNode
    onUpload: (file: File) => void
    onDelete: () => void
    uploaded: string
}

export default function UploadModal({ customButton, onUpload, onDelete, uploaded }: UploadModalProps) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {customButton ?? <Button>Upload</Button>}
            </DialogTrigger>
            <DialogContent data-testid="confirm-dialog">
                <DialogHeader>
                    <DialogTitle>Upload</DialogTitle>
                    <DialogDescription>Upload a file for the track</DialogDescription>
                </DialogHeader>
                {open && (
                    <UploadForm 
                        onUpload={onUpload}
                        onDelete={onDelete}
                        uploaded={uploaded}
                        onClose={() => setOpen(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    )
}