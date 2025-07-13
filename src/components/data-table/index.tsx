"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Track } from "@/lib/api/schemas"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[]
    data: TData[]
    updateData: () => void
    isLoading: boolean
    setFilter: (filter: string) => void
    filterOptions: string[]
}

export interface DataTableMeta {
    updateData: () => void
    isLoading: boolean
    filterOptions: string[],
    setFilter: (filter: string) => void
}

export default function DataTable<TData>({
    columns,
    data,
    updateData,
    isLoading,
    setFilter,
    filterOptions,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData,
            isLoading,
            setFilter,
            filterOptions,
        }
    })

    return (
        <div className="rounded-md border">
            <Table data-testid="data-table">
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => {
                        return (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                </TableHeader>
                <TableBody data-loading={isLoading ? "true" : "false"}>
                    {table.getRowModel().rows?.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map(row => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                data-testid={`track-item-${(row.original as Track)?.id || row.id}`}
                            >
                                {row.getVisibleCells().map(cell => (
                                    <TableCell key={cell.id} width={cell.column.getSize()} data-loading={isLoading ? "true" : "false"}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}