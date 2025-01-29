'use client'

import { useState } from 'react'
import { type Branch } from '@/lib/types/admin'
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DataTableHeader } from '@/components/tables/data-table-header'
import { DataTablePagination } from '@/components/tables/data-table-pagination'
import { DataTableContent } from '@/components/tables/data-table-content'
import { columns } from './columns'

interface BranchConfigDataTableProps {
    data: Branch[]
    onEdit: (branch: Branch) => void
    onDelete: (branch: Branch) => void
}

export function BranchConfigDataTable({
    data,
    onEdit,
    onDelete,
}: BranchConfigDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        meta: {
            onEdit,
            onDelete,
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="flex items-center border rounded-md px-3 gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar sucursal..."
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('name')?.setFilterValue(event.target.value)
                        }
                        className="w-[200px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                </div>
            </div>
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    )
} 