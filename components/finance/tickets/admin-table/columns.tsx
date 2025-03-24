"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui"
import { CheckCircle, XCircle } from "lucide-react"
import type { ParkingTicket } from "@/types/domain/tickets"
import { approveTicket, rejectTicket } from "@/lib/features/tickets"
import { toast } from "sonner"

// Import columns from the core columns file
import {
    bookingIdColumn,
    driverIdColumn,
    vehicleNumberColumn,
    ticketNumberColumn,
    entryDateTimeColumn,
    exitDateTimeColumn,
    amountColumn,
    statusColumn,
    submissionDateColumn,
    imageColumn,
} from "@/components/finance/tickets/table/columns"

// Define admin-specific action column
const actionColumn: ColumnDef<ParkingTicket> = {
    id: "actions",
    header: () => <div className="text-center">Acciones</div>,
    cell: ({ row }) => {
        const status = row.original.status;
        
        // Only show actions for pending tickets
        if (status !== 'pending_review') {
            return (
                <div className="flex justify-center space-x-2">
                    <span className="text-xs text-muted-foreground">Procesado</span>
                </div>
            );
        }
        
        // Create functions to handle approve/reject with proper error handling
        const handleApprove = async () => {
            try {
                await approveTicket(row.original.id);
                toast.success('Ticket aprobado correctamente');
            } catch (error) {
                console.error('Error al aprobar ticket:', error);
                toast.error('Error al aprobar ticket');
            }
        };
        
        const handleReject = async () => {
            try {
                await rejectTicket(row.original.id);
                toast.success('Ticket rechazado correctamente');
            } catch (error) {
                console.error('Error al rechazar ticket:', error);
                toast.error('Error al rechazar ticket');
            }
        };
        
        return (
            <div className="flex justify-center space-x-2">
                <Button
                    variant="outline"
                    size="sm" 
                    className="h-8 px-2 text-xs bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800"
                    onClick={handleApprove}
                >
                    <CheckCircle className="h-4 w-4" /> Aprobar
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-xs bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800"
                    onClick={handleReject}
                >
                    <XCircle className="h-4 w-4" /> Rechazar
                </Button>
            </div>
        );
    },
};

// Compose the admin columns by selecting which columns to include
export const adminColumns: ColumnDef<ParkingTicket>[] = [
    driverIdColumn,
    bookingIdColumn,
    vehicleNumberColumn,
    ticketNumberColumn,
    entryDateTimeColumn,
    exitDateTimeColumn,
    amountColumn,
    submissionDateColumn,
    imageColumn,
    statusColumn,
    actionColumn, // Add the admin-specific actions column
]; 