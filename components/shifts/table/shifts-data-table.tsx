"use client"

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
import { useState, useEffect, useMemo } from "react"
import { DataTableHeader } from "@/components/tables/data-table-header"
import { DataTablePagination } from "@/components/tables/data-table-pagination"
import { DataTableContent } from "@/components/tables/data-table-content"
import { DataTableSearch } from "@/components/tables/data-table-search"
import { DataTableSelect } from "@/components/tables/data-table-select"

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	selectedDays?: number[]
	onEdit?: (shift: TData) => void
	onDelete?: (shift: TData) => void
}

export function ShiftsDataTable<TData, TValue>({
	columns,
	data,
	selectedDays = [1, 2, 3, 4, 5, 6, 7],
	onEdit,
	onDelete,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

	const uniqueBranches = useMemo(() => (
		Array.from(new Set((data as any[]).map(item => item.branch_name)))
			.map(branch => ({ label: branch, value: branch }))
	), [data])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onPaginationChange: setPagination,
		state: {
			sorting,
			columnFilters,
			pagination,
		},
		filterFns: {
			freeDaysFilter: (row, columnId, filterValue: number[]) => {
				const freeDay = (row.getValue(columnId) as number)
				return filterValue.includes(freeDay)
			},
		},
		meta: {
			onEdit,
			onDelete,
		},
		manualPagination: false,
		pageCount: Math.ceil(data.length / pagination.pageSize),
	})

	// Reset pagination when data changes
	useEffect(() => {
		table.resetPagination()
	}, [data, table])

	// Apply free days filter
	useEffect(() => {
		table.getColumn('free_day')?.setFilterValue(selectedDays)
	}, [selectedDays, table])

	return (
		<>
			<div className="flex items-center justify-between gap-4 py-1">
				<div className="flex items-center gap-4">
					<DataTableSearch
						table={table}
						placeholder="Filtrar por nombre..."
						searchColumnId="name"
					/>
					<DataTableSelect
						table={table}
						options={uniqueBranches}
						placeholder="Filtrar por sucursal"
						filterColumnId="branch_name"
						className="w-[180px]"
					/>
				</div>
			</div>
			<DataTableHeader table={table} />
			<DataTableContent table={table} columns={columns.length} />
			<DataTablePagination table={table} />
		</>
	)
}
