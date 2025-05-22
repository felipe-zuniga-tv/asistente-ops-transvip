"use client";

import { DataTable } from "@/components/ui/tables/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { VehicleType } from "@/types/domain/admin/types";

interface DataTableProps {
    columns: ColumnDef<VehicleType>[];
    data: VehicleType[];
    onEdit?: (vehicleType: VehicleType) => void;
    onDelete?: (vehicleType: VehicleType) => void;
}

export function VehicleTypesDataTable({
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
            searchPlaceholder="Buscar tipo de vehículo..."
            searchColumnId="name"
            enableSearch={true}
        />
    );
} 