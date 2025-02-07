"use client";

import { useState, type ReactNode } from "react";
import type {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    Table as TanstackTable,
} from "@tanstack/react-table";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTableHeader } from "./data-table-header";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableContent } from "./data-table-content";
import { DataTableSearch } from "./data-table-search";
import { DataTableSelect } from "./data-table-select";

export interface DataTableFilterOption {
    label: string;
    value: string;
}

interface DataTableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData>[];
    searchPlaceholder?: string;
    searchColumnId?: string;
    filterOptions?: {
        columnId: string;
        options: DataTableFilterOption[];
        placeholder: string;
    }[];
    onEdit?: (row: TData) => void;
    onDelete?: (row: TData) => void;
    onBulkDelete?: (rows: TData[]) => void;
    onBulkDownload?: (rows: TData[]) => void;
    onSelectionChange?: (rows: TData[]) => void;
    enableRowSelection?: boolean;
    enableSearch?: boolean;
    initialPageSize?: number;
    meta?: Record<string, unknown>;
    children?: ReactNode;
}

export function DataTable<TData>({
    data,
    columns,
    searchPlaceholder = "Buscar...",
    searchColumnId,
    filterOptions = [],
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkDownload,
    onSelectionChange,
    enableRowSelection = false,
    enableSearch = true,
    initialPageSize = 10,
    meta,
    children,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

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
        ...(enableRowSelection && {
            onRowSelectionChange: (updatedSelection) => {
                setRowSelection(updatedSelection);
                if (onSelectionChange) {
                    const selectedRows = table
                        .getFilteredSelectedRowModel()
                        .rows.map((row) => row.original);
                    onSelectionChange(selectedRows);
                }
            },
        }),
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
            ...(enableRowSelection && {
                rowSelection,
            }),
        },
        filterFns: {
            fuzzy: (row, columnId, value) => {
                const rowValue = String(row.getValue(columnId));
                return rowValue.toLowerCase().includes(String(value).toLowerCase());
            },
        },
        meta: {
            onEdit,
            onDelete,
            ...meta,
        },
    });

    return (
        <div className="space-y-4">
            {(enableSearch || filterOptions.length > 0) && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    {filterOptions.length > 0 && (
                        <div className="flex gap-2">
                            {filterOptions.map((filter) => (
                                <DataTableSelect
                                    key={filter.columnId}
                                    table={table}
                                    options={filter.options}
                                    placeholder={filter.placeholder}
                                    filterColumnId={filter.columnId}
                                    className="w-[220px]"
                                />
                            ))}
                        </div>
                    )}
                    {enableSearch && searchColumnId && (
                        <DataTableSearch
                            table={table}
                            placeholder={searchPlaceholder}
                            searchColumnId={searchColumnId}
                        />
                    )}
                </div>
            )}
            {children}
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    );
} 