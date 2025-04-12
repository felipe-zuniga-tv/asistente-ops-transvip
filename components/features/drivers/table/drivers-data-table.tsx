"use client"

import { useMemo } from "react"
import { DataTable } from "@/components/ui/tables/data-table"
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container"
import { columns } from "./columns"
import type { Driver } from "@/components/features/drivers/types"

interface DriversDataTableProps {
	data: Driver[]
	onEdit?: (driver: Driver) => void
	onDelete?: (driver: Driver) => void
	onAdd?: () => void
}

export function DriversDataTable({
	data,
	onEdit,
	onDelete,
	onAdd,
}: DriversDataTableProps) {
	const branchFilterOptions = useMemo(() => {
		const branches = Array.from(new Set(data.map((driver) => driver.branch_name)))
		return [
			...branches.map((branch) => ({ label: branch, value: branch })),
		]
	}, [data])

	return (
		<ConfigCardContainer title="Conductores" className="max-w-full">
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
						options: branchFilterOptions,
						placeholder: "Filtrar por Sucursal",
					},
				]}
				enableRowSelection={false}
			/>
		</ConfigCardContainer>
	)
} 