"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/tables/data-table";
import { columns, statusLabels } from "./table/columns";
import type { SalesResponse } from "@/types/domain/sales/types";

interface SalesResponsesTableProps {
	data: SalesResponse[];
	onUpdateStatus: (id: string, status: string) => Promise<void>;
	onConfirmWhatsapp: (id: string, confirmed: boolean) => Promise<void>;
	onUpdateNotes: (id: string) => void;
	onSendWhatsApp: (response: SalesResponse) => void;
}

export function SalesResponsesTable({
	data,
	onUpdateStatus,
	onConfirmWhatsapp,
	onUpdateNotes,
	onSendWhatsApp,
}: SalesResponsesTableProps) {
	const uniqueBranches = useMemo(() => (
		Array.from(new Set(data.map(item => item.branch_name)))
			.map(branch => ({ label: branch, value: branch }))
	), [data]);

	const statusOptions = useMemo(() => (
		Object.entries(statusLabels).map(([value, label]) => ({
			label,
			value
		}))
	), []);

	return (
		<DataTable
			data={data}
			columns={columns}
			filterOptions={[
				{
					columnId: "branch_name",
					options: uniqueBranches,
					placeholder: "Filtrar por sucursal"
				},
				{
					columnId: "status",
					options: statusOptions,
					placeholder: "Filtrar por estado"
				}
			]}
			meta={{ onUpdateStatus, onConfirmWhatsapp, onUpdateNotes, onSendWhatsApp }}
		/>
	);
}