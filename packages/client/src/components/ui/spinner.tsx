export default function Spinner() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading...</p>
            </div>
        </div>
    )
}