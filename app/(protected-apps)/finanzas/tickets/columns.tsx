"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import {
    Badge,
    Button,
} from "@/components/ui"
import { CheckCircle, XCircle, ArrowUp, ArrowDown } from "lucide-react"
import type { ParkingTicket } from "@/types"
import TicketImageViewer from "@/components/finance/tickets/table/ticket-image-viewer"
import { statusMap } from "@/components/finance/tickets/table/columns"
import { approveTicket, rejectTicket } from "./actions"
import { toast } from "sonner"

export const adminColumns: ColumnDef<ParkingTicket>[] = [
    {
        accessorKey: "driver_id",
        header: () => <div className="text-center">ID Conductor</div>,
        cell: ({ row }) => (
            <div className="text-center text-xs">
                {row.original.driver_id}
            </div>
        ),
    },
    {
        accessorKey: "booking_id",
        header: () => <div className="text-center"># Reserva</div>,
        cell: ({ row }) => (
            <div className="text-center text-xs">
                {row.original.booking_id}
            </div>
        ),
    },
    {
        accessorKey: "vehicle_number",
        header: () => <div className="text-center"># Móvil</div>,
        cell: ({ row }) => (
            <div className="text-center text-xs">
                {row.original.vehicle_number || "N/A"}
            </div>
        ),
    },
    {
        accessorKey: "parsed_data.nro_boleta",
        header: () => <div className="text-center">N° Boleta</div>,
        cell: ({ row }) => (
            <div className="text-center text-xs">
                {row.original.parsed_data.nro_boleta}
            </div>
        ),
    },
    {
        id: "entry_datetime",
        header: () => <div className="text-center">Entrada</div>,
        cell: ({ row }) => {
            const entryDate = row.original.parsed_data.entry_date
            const entryTime = row.original.parsed_data.entry_time
            
            // Only attempt to format if both date and time exist
            if (entryDate && entryTime) {
                try {
                    // Parse the date and time strings into a Date object
                    const dateTimeStr = `${entryDate} ${entryTime}`
                    const dateTime = parse(dateTimeStr, 'dd/MM/yyyy HH:mm', new Date())
                    
                    return (
                        <div className="text-center text-xs">
                            {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                    )
                } catch (error) {
                    return (
                        <div className="text-center text-xs text-muted-foreground">
                            {entryDate} {entryTime}
                        </div>
                    )
                }
            }
            
            return (
                <div className="text-center text-xs text-muted-foreground">
                    No disponible
                </div>
            )
        },
    },
    {
        id: "exit_datetime",
        header: () => <div className="text-center">Salida</div>,
        cell: ({ row }) => {
            const exitDate = row.original.parsed_data.exit_date
            const exitTime = row.original.parsed_data.exit_time
            
            // Only attempt to format if both date and time exist
            if (exitDate && exitTime) {
                try {
                    // Parse the date and time strings into a Date object
                    const dateTimeStr = `${exitDate} ${exitTime}`
                    const dateTime = parse(dateTimeStr, 'dd/MM/yyyy HH:mm', new Date())
                    
                    return (
                        <div className="text-center text-xs">
                            {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                    )
                } catch (error) {
                    return (
                        <div className="text-center text-xs text-muted-foreground">
                            {exitDate} {exitTime}
                        </div>
                    )
                }
            }
            
            return (
                <div className="text-center text-xs text-muted-foreground">
                    No disponible
                </div>
            )
        },
    },
    {
        accessorKey: "parsed_data.amount",
        header: () => <div className="text-center">Monto</div>,
        cell: ({ row }) => {
            const amount = row.original.parsed_data.amount as number
            const formatted = new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
            }).format(amount)
            return (
                <div className="text-center text-xs">
                    {formatted}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusMap
            const config = statusMap[status]
            return (
                <div className="text-center text-xs">
                    <Badge className={config.className}>
                        {config.label}
                    </Badge>
                </div>
            )
        },
    },
    {
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
            )
        },
        cell: ({ row }) => {
            const submissionDate = row.original.submission_date
            
            if (submissionDate) {
                try {
                    const date = new Date(submissionDate)
                    
                    return (
                        <div className="text-center text-xs">
                            {format(date, "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                    )
                } catch (error) {
                    return (
                        <div className="text-center text-xs text-muted-foreground">
                            Formato inválido
                        </div>
                    )
                }
            }
            
            return (
                <div className="text-center text-xs text-muted-foreground">
                    No disponible
                </div>
            )
        },
    },
    {
        id: "thumbnail",
        header: () => <div className="text-center">Imagen</div>,
        cell: ({ row }) => {
            // The image_url is stored within the parsed_data object
            const imageUrl = row.original.parsed_data.image_url
            
            if (!imageUrl) {
                return (
                    <div className="text-center text-xs text-muted-foreground">
                        No disponible
                    </div>
                )
            }
            
            return (
                <div className="text-center text-xs">
                    <TicketImageViewer imageUrl={imageUrl} />
                </div>
            )
        },
    },
    {
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
                        <CheckCircle className="h-4 w-4 mr-1" /> Aprobar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800"
                        onClick={handleReject}
                    >
                        <XCircle className="h-4 w-4 mr-1" /> Rechazar
                    </Button>
                </div>
            );
        },
    },
]; 