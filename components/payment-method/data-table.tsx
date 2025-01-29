'use client'

import * as React from 'react'
import { type PaymentMethod } from '@/lib/types/payment-method'
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { DataTableHeader } from '@/components/tables/data-table-header'
import { DataTablePagination } from '@/components/tables/data-table-pagination'
import { DataTableContent } from '@/components/tables/data-table-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface DataTableProps {
    data: PaymentMethod[]
    onEdit?: (method: PaymentMethod) => void
    onDelete?: (method: PaymentMethod) => void
}

export function PaymentMethodDataTable({
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const columns: ColumnDef<PaymentMethod>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
        },
        {
            accessorKey: 'code',
            header: 'Código',
        },
        {
            accessorKey: 'icon_name',
            header: 'Ícono',
        },
        {
            accessorKey: 'description',
            header: 'Descripción',
        },
        {
            accessorKey: 'is_active',
            header: 'Estado',
            cell: ({ row }) => (
                <Badge
                    variant={row.original.is_active ? 'default' : 'secondary'}
                >
                    {row.original.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit?.(row.original)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete?.(row.original)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ]

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
            onEdit: (method: PaymentMethod) => {
                onEdit?.(method)
            },
            onDelete: (method: PaymentMethod) => {
                onDelete?.(method)
            },
        },
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="flex items-center border rounded-md px-3 gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar método de pago..."
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
