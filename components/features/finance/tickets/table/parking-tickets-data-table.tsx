"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ParkingTicket } from "@/types/domain/tickets";
import { DataTable } from "@/components/ui/tables/data-table";
import { statusMap } from "./status-map";

interface DataTableProps {
    columns: ColumnDef<ParkingTicket>[];
    data: ParkingTicket[];
    onEdit?: (ticket: ParkingTicket) => void;
    onDelete?: (ticket: ParkingTicket) => void;
    initialPageSize?: number;
}

export function ParkingTicketsDataTable({
    columns,
    data,
    onEdit,
    onDelete,
    initialPageSize,
}: DataTableProps) {
    // Create status options from statusMap
    const statusOptions = Object.entries(statusMap).map(([value, config]) => ({
        label: config.label,
        value,
    }));

    return (
        <DataTable
            data={data}
            columns={columns}
            onEdit={onEdit}
            onDelete={onDelete}
            searchPlaceholder="Filtrar por # de reserva..."
            searchColumnId="booking_id"
            enableSearch={true}
            initialPageSize={initialPageSize}
            filterOptions={[
                {
                    columnId: "status",
                    options: statusOptions,
                    placeholder: "Filtrar por estado",
                },
            ]}
        />
    );
} 