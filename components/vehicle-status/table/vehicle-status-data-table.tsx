"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTableHeader } from "@/components/tables/data-table-header";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableContent } from "@/components/tables/data-table-content";
import { VehicleStatus } from "@/lib/types";

interface DataTableProps {
    columns: ColumnDef<VehicleStatus>[];
    data: VehicleStatus[];
    onEdit?: (status: VehicleStatus) => void;
    onDelete?: (status: VehicleStatus) => void;
}

export function VehicleStatusDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        filterFns: {
            fuzzy: (row, columnId, value) => {
                const rowValue = String(row.getValue(columnId))
                return rowValue.toLowerCase().includes(String(value).toLowerCase())
            },
        },
        meta: {
            onEdit,
            onDelete,
        },
    });

    return (
        <>
            <div className="flex items-center justify-between gap-4 py-1">
                <div className="relative">
                    <Input
                        placeholder="Filtrar por móvil..."
                        value={(table.getColumn("vehicle_number")?.getFilterValue() as string) ?? ""}
                        onChange={(event) => {
                            table.getColumn("vehicle_number")?.setFilterValue(event.target.value);
                        }}
                        className="peer pe-9 ps-9 max-w-xs"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <Search size={16} strokeWidth={2} />
                    </div>
                </div>
            </div>
            <DataTableHeader table={table} />
            <DataTableContent table={table} columns={columns.length} />
            <DataTablePagination table={table} />
        </>
    );
} 