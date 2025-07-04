import { zodResolver } from "@hookform/resolvers/zod"
import { UploadIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"

const uploadFormSchema = z.object({
    file: z.instanceof(File).refine(
        (file) => ["audio/mpeg", "audio/wav", "audio/wave", "audio/x-wav"].includes(file.type), {
        message: "File must be a valid MP3 or WAV file",
    }),
})

type UploadFormValues = z.infer<typeof uploadFormSchema>

interface UploadFormProps {
    onUpload: (file: File) => void
    onDelete: () => void
    uploaded: string
    onClose: () => void
}

export default function UploadForm({ onUpload, onDelete, uploaded, onClose }: UploadFormProps) {
    const [uploadedFileName, setUploadedFileName] = useState<string>(uploaded)
    const form = useForm<UploadFormValues>({
        resolver: zodResolver(uploadFormSchema),
    })

    const onSubmit = async (data: UploadFormValues) => {
        onUpload(data.file)
        setUploadedFileName(data.file.name)
    }

    const handleDelete = () => {
        setUploadedFileName("")
        onClose()
        onDelete()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>File</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <label
                                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <UploadIcon className="w-8 h-8 mb-2 text-gray-500" />
                                            <p className="mb-1 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">MP3 or WAV (max 50MB)</p>
                                        </div>
                                        <Input
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            accept=".mp3,.wav"
                                            type="file"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    field.onChange(e.target.files[0])
                                                    setUploadedFileName(e.target.files[0].name)
                                                }
                                            }}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                            data-testid="file-input"
                                        />
                                    </label>
                                    {(field.value || uploadedFileName) && (
                                        <p className="mt-2 text-sm text-green-600">
                                            Selected: {field.value ? field.value.name : uploadedFileName}
                                        </p>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end mt-4 gap-2">
                    {uploaded && (
                        <Button type="button" variant="destructive" onClick={handleDelete} data-testid="confirm-delete">Delete</Button>
                    )}
                    <Button type="submit" data-testid="upload-button">Upload</Button>
                </div>
            </form>
        </Form>
    )
} 