"use client";

import { DataTable } from "@/components/ui/tables/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { VehicleStatusConfig } from "@/types/domain/vehicle/types";

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