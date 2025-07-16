import Image from "next/image";

export default function Spinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <Image src="/loading-indicator.webp" alt="Loading..." width={48} height={48} className="animate-spin mx-auto mb-4" />
            </div>
        </div>
    )
}