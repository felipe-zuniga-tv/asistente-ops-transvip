"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VehicleStatusConfig } from "@/lib/types/vehicle/status";
import { DataTable } from "@/components/tables/data-table";

interface DataTableProps {
    columns: ColumnDef<VehicleStatusConfig>[];
    data: VehicleStatusConfig[];
    onEdit?: (config: VehicleStatusConfig) => void;
    onDelete?: (config: VehicleStatusConfig) => void;
}

export function VehicleStatusConfigDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    return (
        <DataTable
            data={data}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Buscar estado..."
            searchColumnId="label"
            enableSearch={true}
        />
    );
} 