"use client"

import { useEffect, useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/tables/data-table"

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
	
	// Filter the data by free_day if selectedDays is provided
	const filteredData = useMemo(() => {
		if (!selectedDays || selectedDays.length === 7) {
			return data; // Show all data if all days are selected
		}
		return (data as any[]).filter(item => selectedDays.includes(item.free_day));
	}, [data, selectedDays]);

	// Apply the free_day filter when selectedDays changes
	useEffect(() => {
		// No additional setup needed as we're filtering the data directly
	}, [selectedDays]);

	return (
		<DataTable
			data={filteredData}
			columns={columns}
			compact={true}
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
				selectedDays,
			}}
		/>
	)
}
