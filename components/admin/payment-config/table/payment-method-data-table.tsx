'use client'

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { useState } from "react"
import { DataTableHeader } from "@/components/tables/data-table-header"
import { DataTablePagination } from "@/components/tables/data-table-pagination"
import { DataTableContent } from "@/components/tables/data-table-content"
import { DataTableSearch } from "@/components/tables/data-table-search"
import type { PaymentMethod } from '@/lib/types/admin'

interface PaymentMethodDataTableProps {
    columns: ColumnDef<PaymentMethod>[]
    data: PaymentMethod[]
    onEdit?: (method: PaymentMethod) => void
    onDelete?: (method: PaymentMethod) => void
}

export function PaymentMethodDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: PaymentMethodDataTableProps) {
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
            <DataTableSearch table={table} placeholder="Buscar método de pago..." 
                searchColumnId="name" />
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    )
} 