"use client";

import * as React from "react";
import {
    // ColumnDef,
    ColumnFiltersState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataTableHeader } from "@/components/tables/data-table-header";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableContent } from "@/components/tables/data-table-content";
import { DataTableSearch } from "@/components/tables/data-table-search";
import { columns } from "./columns";
import type { OperationsFormQuestion } from "@/lib/types/vehicle/forms";

interface OperationsFormQuestionsDataTableProps {
    data: OperationsFormQuestion[];
    onEdit: (question: OperationsFormQuestion) => void;
    onDelete: (question: OperationsFormQuestion) => void;
}

export function OperationsFormQuestionsDataTable({
    data,
    onEdit,
    onDelete,
}: OperationsFormQuestionsDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns: columns({ onEdit, onDelete }),
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
    });

    return (
        <div className="space-y-4">
            <DataTableSearch table={table} 
                placeholder="Buscar pregunta..."
                searchColumnId="label"
            />
            <DataTableHeader table={table} />
            <DataTableContent columns={columns.length} table={table} />
            <DataTablePagination table={table} />
        </div>
    );
} 