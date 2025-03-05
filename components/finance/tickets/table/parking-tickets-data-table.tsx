"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ParkingTicket } from "@/types";
import { DataTable } from "@/components/tables/data-table";

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
    // Create unique status options from data
    const statusOptions = Array.from(new Set(data.map(item => item.status))).map(status => ({
        label: status,
        value: status,
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