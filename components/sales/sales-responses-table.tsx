"use client";

import * as React from "react";
import {
	ColumnFiltersState,
	SortingState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	TableMeta as TanStackTableMeta,
} from "@tanstack/react-table";

import type { SalesResponse } from "@/lib/types/sales";
import { DataTableHeader } from "@/components/tables/data-table-header";
import { DataTablePagination } from "@/components/tables/data-table-pagination";
import { DataTableContent } from "@/components/tables/data-table-content";
import { DataTableSearch } from "@/components/tables/data-table-search";
import { columns } from "./table/columns";

interface SalesResponsesTableProps {
	data: SalesResponse[]
	onUpdateStatus: (id: string, status: SalesResponse['status']) => Promise<void>
	onConfirmWhatsapp: (id: string, confirmed: boolean) => Promise<void>
	onUpdateNotes: (id: string, notes: string) => Promise<void>
}

interface SalesTableMeta extends TanStackTableMeta<SalesResponse> {
	onUpdateStatus: (id: string, status: SalesResponse['status']) => Promise<void>;
	onConfirmWhatsapp: (id: string, confirmed: boolean) => Promise<void>;
	onUpdateNotes: (id: string, notes: string) => Promise<void>;
}

export function SalesResponsesTable({
	data,
	onUpdateStatus,
	onConfirmWhatsapp,
	onUpdateNotes,
}: SalesResponsesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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
			onUpdateStatus,
			onConfirmWhatsapp,
			onUpdateNotes,
		} as SalesTableMeta,
	});

	return (
		<div className="space-y-4">
			<DataTableSearch 
				table={table} 
				placeholder="Buscar respuesta..."
				searchColumnId="branch_name"
			/>
			<DataTableHeader table={table} />
			<DataTableContent columns={columns.length} table={table} />
			<DataTablePagination table={table} />
		</div>
	);
}