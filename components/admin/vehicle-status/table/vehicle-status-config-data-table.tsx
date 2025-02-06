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
import type { VehicleStatusConfig } from "@/lib/types/vehicle/status";

interface DataTableProps {
    columns: ColumnDef<VehicleStatusConfig>[];
    data: VehicleStatusConfig[];
    onEdit?: (config: VehicleStatusConfig) => void;
    onDelete?: (config: VehicleStatusConfig) => void;
}

export function VehicleStatusConfigDataTable({
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
            onEdit: (config: VehicleStatusConfig) => {
                onEdit?.(config);
            },
            onDelete: (config: VehicleStatusConfig) => {
                onDelete?.(config);
            },
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <div className="flex items-center border rounded-md px-3 gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar estado..."
                        value={(table.getColumn("label")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("label")?.setFilterValue(event.target.value)
                        }
                        className="w-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    />
                </div>
            </div>
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    );
} 