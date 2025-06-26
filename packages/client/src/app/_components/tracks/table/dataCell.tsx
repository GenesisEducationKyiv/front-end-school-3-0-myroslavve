import { Skeleton } from "@/components/ui/skeleton";

export default function DataCell({
    content,
    isLoading,
    width,
    'data-testid': dataTestId
}: {
    content: string,
    isLoading: boolean,
    width?: string,
    'data-testid'?: string
}) {
    return (
        <div
            className="flex items-center gap-2"
            style={{ width: width }}
            data-testid={dataTestId}
            data-loading={isLoading ? "true" : "false"}
        >
            {isLoading ? (
                <Skeleton className="w-full h-4" />
            ) : (
                content
            )}
        </div>
    )
}