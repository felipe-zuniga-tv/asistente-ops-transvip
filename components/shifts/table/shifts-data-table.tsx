"use client"

import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { DataTableHeader } from "@/components/tables/data-table-header"
import { DataTablePagination } from "@/components/tables/data-table-pagination"

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

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		state: {
			sorting,
			columnFilters,
		},
		filterFns: {
			freeDaysFilter: (row, columnId, filterValue: number[]) => {
				const freeDay = (row.original as any).free_day
				return filterValue.includes(freeDay)
			},
		},
		meta: {
			onEdit,
			onDelete,
		},
	})

	useEffect(() => {
		table.getColumn('free_day')?.setFilterValue(selectedDays)
	}, [selectedDays, table])

	return (
		<>
			<div className="flex items-center justify-between gap-4 py-1">
				<div className="relative">
					<Input
						placeholder="Filtrar por nombre..."
						value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("name")?.setFilterValue(event.target.value)
						}
						className="peer pe-9 ps-9 max-w-sm"
					/>
					<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
						<Search size={16} strokeWidth={2} />
					</div>
				</div>
			</div>
			<DataTableHeader table={table} />
			<div className="rounded-md border">
				<Table>
					<TableHeader className="bg-gray-100">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No hay resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</>
	)
}
