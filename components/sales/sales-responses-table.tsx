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
import { DataTableSelect } from "@/components/tables/data-table-select";
import { columns, statusLabels } from "./table/columns";

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

	// Get unique branch names for the select filter
	const uniqueBranches = React.useMemo(() => {
		const branches = Array.from(new Set(data.map(item => item.branch_name)));
		return branches.map(branch => ({
			label: branch,
			value: branch
		}));
	}, [data]);

	// Create status options from statusLabels
	const statusOptions = React.useMemo(() => {
		return Object.entries(statusLabels).map(([value, label]) => ({
			label,
			value
		}));
	}, []);

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
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
				<div className="flex gap-2">
					<DataTableSelect
						table={table}
						options={uniqueBranches}
						placeholder="Filtrar por sucursal"
						filterColumnId="branch_name"
						className="w-[180px]"
					/>
					<DataTableSelect
						table={table}
						options={statusOptions}
						placeholder="Filtrar por estado"
						filterColumnId="status"
						className="w-[180px]"
					/>
				</div>
			</div>
			<DataTableHeader table={table} />
			<DataTableContent columns={columns.length} table={table} />
			<DataTablePagination table={table} />
		</div>
	);
}