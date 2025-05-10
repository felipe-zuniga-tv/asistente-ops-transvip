"use client"

import { Table } from "@tanstack/react-table"
import {
    Table as UITable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { flexRender } from "@tanstack/react-table"

interface DataTableContentProps<TData> {
    table: Table<TData>
    columns: number
    compact?: boolean
}

export function DataTableContent<TData>({
    table,
    columns,
    compact = false,
}: DataTableContentProps<TData>) {
    return (
        <div className="rounded-md border">
            <UITable>
                <TableHeader className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
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
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className={`h-${compact ? 3 : 4} p-${compact ? 0.5 : 1}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className={`h-${compact ? 3 : 4} p-${compact ? 0.5 : 1}`}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns} className="h-24 text-center">
                                No hay resultados.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </UITable>
        </div>
    )
} 