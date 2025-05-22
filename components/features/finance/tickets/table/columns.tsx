"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import {
    Badge,
    Button,
} from "@/components/ui"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { ParkingTicket } from "@/types/domain/tickets/types"
import TicketImageViewer from "./ticket-image-viewer"
import { statusMap, type TicketStatus } from "./status-map"

// Helper for date formatting
const formatDateTime = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return null;
    
    try {
        const dateTimeStr = `${dateStr} ${timeStr}`;
        return parse(dateTimeStr, 'dd/MM/yyyy HH:mm', new Date());
    } catch (error) {
        return null;
    }
};

// Export individual column definitions
export const bookingIdColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "booking_id",
    header: () => <div className="text-center"># Reserva</div>,
    cell: ({ row }) => (
        <div className="text-center text-xs">
            {row.original.booking_id}
        </div>
    ),
};

export const vehicleNumberColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "vehicle_number",
    header: () => <div className="text-center"># Móvil</div>,
    cell: ({ row }) => (
        <div className="text-center text-xs">
            {row.original.vehicle_number || "No disponible"}
        </div>
    ),
};

export const driverIdColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "driver_id",
    header: () => <div className="text-center">ID Conductor</div>,
    cell: ({ row }) => (
        <div className="text-center text-xs">
            {row.original.driver_id}
        </div>
    ),
};

export const ticketNumberColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "parsed_data.nro_boleta",
    header: () => <div className="text-center">N° Boleta</div>,
    cell: ({ row }) => (
        <div className="text-center text-xs">
            {row.original.parsed_data.nro_boleta}
        </div>
    ),
};

export const entryDateTimeColumn: ColumnDef<ParkingTicket> = {
    id: "entry_datetime",
    header: () => <div className="text-center">Entrada</div>,
    cell: ({ row }) => {
        const entryDate = row.original.parsed_data.entry_date;
        const entryTime = row.original.parsed_data.entry_time;
        
        const dateTime = formatDateTime(entryDate, entryTime);
        
        if (dateTime) {
            return (
                <div className="text-center text-xs">
                    {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
            );
        }
        
        if (entryDate && entryTime) {
            return (
                <div className="text-center text-xs text-muted-foreground">
                    {entryDate} {entryTime}
                </div>
            );
        }
        
        return (
            <div className="text-center text-xs text-muted-foreground">
                No disponible
            </div>
        );
    },
};

export const exitDateTimeColumn: ColumnDef<ParkingTicket> = {
    id: "exit_datetime",
    header: () => <div className="text-center">Salida</div>,
    cell: ({ row }) => {
        const exitDate = row.original.parsed_data.exit_date;
        const exitTime = row.original.parsed_data.exit_time;
        
        const dateTime = formatDateTime(exitDate, exitTime);
        
        if (dateTime) {
            return (
                <div className="text-center text-xs">
                    {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
            );
        }
        
        if (exitDate && exitTime) {
            return (
                <div className="text-center text-xs text-muted-foreground">
                    {exitDate} {exitTime}
                </div>
            );
        }
        
        return (
            <div className="text-center text-xs text-muted-foreground">
                No disponible
            </div>
        );
    },
};

export const locationColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "parsed_data.location",
    header: () => <div className="text-center">Ubicación</div>,
    cell: ({ row }) => (
        <div className="text-center text-xs">
            {row.original.parsed_data.location || "No disponible"}
        </div>
    ),
};

export const amountColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "parsed_data.amount",
    header: () => <div className="text-center">Monto</div>,
    cell: ({ row }) => {
        const amount = row.original.parsed_data.amount as number;
        const formatted = new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
        }).format(amount);
        return (
            <div className="text-center text-xs">
                {formatted}
            </div>
        );
    },
};

export const statusColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "status",
    header: () => <div className="text-center">Estado</div>,
    cell: ({ row }) => {
        const status = row.getValue("status") as TicketStatus;
        const config = statusMap[status];
        return (
            <div className="text-center text-xs">
                <Badge className={config.className}>
                    {config.label}
                </Badge>
            </div>
        );
    },
};

export const submissionDateColumn: ColumnDef<ParkingTicket> = {
    accessorKey: "submission_date",
    header: ({ column }) => {
        return (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha de Envío
                    {column.getIsSorted() ? (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
                </Button>
            </div>
        );
    },
    cell: ({ row }) => {
        const submissionDate = row.original.submission_date;
        
        if (submissionDate) {
            try {
                const date = new Date(submissionDate);
                
                return (
                    <div className="text-center text-xs">
                        {format(date, "dd/MM/yyyy HH:mm", { locale: es })}
                    </div>
                );
            } catch (error) {
                return (
                    <div className="text-center text-xs text-muted-foreground">
                        Formato inválido
                    </div>
                );
            }
        }
        
        return (
            <div className="text-center text-xs text-muted-foreground">
                No disponible
            </div>
        );
    },
};

export const imageColumn: ColumnDef<ParkingTicket> = {
    id: "thumbnail",
    header: () => <div className="text-center">Imagen</div>,
    cell: ({ row }) => {
        // The image_url is stored within the parsed_data object
        const imageUrl = row.original.parsed_data.image_url;
        
        if (!imageUrl) {
            return (
                <div className="text-center text-xs text-muted-foreground">
                    No disponible
                </div>
            );
        }
        
        return (
            <div className="text-center text-xs">
                <TicketImageViewer imageUrl={imageUrl} />
            </div>
        );
    },
};

// Export the default columns array
export const columns: ColumnDef<ParkingTicket>[] = [
    bookingIdColumn,
    vehicleNumberColumn,
    ticketNumberColumn,
    entryDateTimeColumn,
    exitDateTimeColumn,
    locationColumn,
    amountColumn,
    statusColumn,
    submissionDateColumn,
    imageColumn,
]; 