"use client"

import { DataTableMeta } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Track } from "@/lib/api/schemas";
import { ColumnDef } from "@tanstack/react-table";
import PlayCell from "./playCell";
import ActionCell from "./actionCell";
import ActionHeader from "./actionHeader";
import DataCell from "./dataCell";
import FilterHeader from "./filterHeader";

export const columns: ColumnDef<Track>[] = [
    {
        id: "select",
        size: 3,
        minSize: 3,
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                data-testid="select-all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                data-testid={`track-checkbox-${row.original.id}`}
            />
        ),
    },
    {
        id: "play",
        size: 3,
        minSize: 3,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <PlayCell row={row} isLoading={isLoading} />
        },
    },
    {
        accessorKey: "title",
        header: "Title",
        size: 20,
        minSize: 20,
        maxSize: 20,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell
                content={row.original.title}
                isLoading={isLoading}
                data-testid={`track-item-${row.original.id}-title`}
            />
        },
    },
    {
        accessorKey: "artist",
        header: "Artist",
        size: 14,
        minSize: 14,
        maxSize: 14,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell
                content={row.original.artist}
                isLoading={isLoading}
                data-testid={`track-item-${row.original.id}-artist`}
            />
        },
    },
    {
        accessorKey: "genres",
        size: 15,
        minSize: 15,
        maxSize: 15,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell content={row.original.genres?.join(", ") ?? ""} isLoading={isLoading} />
        },
        header: ({ table }) => {
            const { filterOptions, setFilter } = table.options.meta as DataTableMeta;
            return <FilterHeader content="Genres" filterOptions={filterOptions} setFilter={setFilter} data-testid="filter-genre" />
        },
    },
    {
        accessorKey: "album",
        header: "Album",
        size: 14,
        minSize: 14,
        maxSize: 14,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell content={row.original.album ?? ""} isLoading={isLoading} />
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        size: 14,
        minSize: 14,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell content={new Date(row.original.createdAt).toLocaleString()} isLoading={isLoading} />
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated",
        size: 14,
        minSize: 14,
        cell: ({ row, table }) => {
            const { isLoading } = table.options.meta as DataTableMeta;
            return <DataCell content={new Date(row.original.updatedAt).toLocaleString()} isLoading={isLoading} />
        },
    },
    {
        id: "actions",
        size: 3,
        minSize: 3,
        header: ({ table }) => {
            const { updateData, isLoading } = table.options.meta as DataTableMeta;

            return <ActionHeader
                rows={table.getFilteredSelectedRowModel().rows}
                updateData={updateData}
                removeSelectionRows={() => table.toggleAllRowsSelected(false)}
                isLoading={isLoading}
            />
        },
        cell: ({ row, table }) => {
            const { updateData, isLoading } = table.options.meta as DataTableMeta;

            return <ActionCell row={row} updateData={updateData} isLoading={isLoading} />
        },
    }
]
