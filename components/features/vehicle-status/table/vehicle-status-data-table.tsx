"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { VehicleStatus } from "@/types/domain/vehicle/types";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface DataTableProps {
    columns: ColumnDef<VehicleStatus>[];
    data: VehicleStatus[];
    onEdit?: (status: VehicleStatus) => void;
    onDelete?: (status: VehicleStatus) => void;
}

export function VehicleStatusDataTable({
    columns,
    data,
    onEdit,
    onDelete,
}: DataTableProps) {
    // Create unique status options from data
    const statusOptions = Array.from(new Set(data.map(item => item.status_label))).map(label => ({
        label,
        value: label,
    }));

    return (
        <DataTable
            data={data}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Filtrar por móvil..."
            searchColumnId="vehicle_number"
            enableSearch={true}
            filterOptions={[
                {
                    columnId: "status_label",
                    options: statusOptions,
                    placeholder: "Filtrar por estado",
                },
            ]}
        />
    );
} 