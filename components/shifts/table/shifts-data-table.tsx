"use client"

import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/tables/data-table"

interface DataTableProps<TData> {
	columns: ColumnDef<TData>[]
	data: TData[]
	selectedDays?: number[]
	onEdit?: (shift: TData) => void
	onDelete?: (shift: TData) => void
}

export function ShiftsDataTable<TData>({
	columns,
	data,
	selectedDays = [1, 2, 3, 4, 5, 6, 7],
	onEdit,
	onDelete,
}: DataTableProps<TData>) {
	const uniqueBranches = useMemo(() => (
		Array.from(new Set((data as any[]).map(item => item.branch_name)))
			.map(branch => ({ label: branch, value: branch }))
	), [data])

	return (
		<DataTable
			data={data}
			columns={columns}
			onEdit={onEdit}
			onDelete={onDelete}
			searchPlaceholder="Filtrar por nombre..."
			searchColumnId="name"
			filterOptions={[
				{
					columnId: "branch_name",
					options: uniqueBranches,
					placeholder: "Filtrar por sucursal"
				}
			]}
			meta={{
				freeDaysFilter: (row: any, columnId: string, filterValue: number[]) => {
					const freeDay = row.getValue(columnId) as number
					return filterValue.includes(freeDay)
				},
				selectedDays,
			}}
		/>
	)
}
