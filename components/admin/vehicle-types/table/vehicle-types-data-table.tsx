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
import type { VehicleType } from "@/lib/types/admin";
import { DataTableSearch } from "@/components/tables/data-table-search";

interface DataTableProps {
    columns: ColumnDef<VehicleType>[];
    data: VehicleType[];
    onEdit?: (vehicleType: VehicleType) => void;
    onDelete?: (vehicleType: VehicleType) => void;
}

export function VehicleTypesDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        meta: {
            onEdit: (vehicleType: VehicleType) => {
                onEdit?.(vehicleType);
            },
            onDelete: (vehicleType: VehicleType) => {
                onDelete?.(vehicleType);
            },
        },
    });

    return (
        <div className="space-y-4">
            <DataTableSearch 
                table={table} 
                placeholder="Buscar tipo de vehículo..."
                searchColumnId="name"
            />
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    );
} 