import Image from "next/image";

export default function Spinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <Image src="/loading-indicator.webp" alt="Loading..." className="animate-spin h-12 w-12 mx-auto mb-4" />
            </div>
        </div>
    )
}