"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { VehicleType } from "@/lib/types/admin";
import { DataTable } from "@/components/tables/data-table";

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