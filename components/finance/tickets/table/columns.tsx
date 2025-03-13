"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import {
    Badge,
    Button,
} from "@/components/ui"
import { ArrowUp, ArrowDown } from "lucide-react"
import type { ParkingTicket } from "@/types"
import TicketImageViewer from "./ticket-image-viewer"

export const statusMap = {
    pending_review: { label: "Pendiente", variant: "warning", className: "bg-yellow-100 text-black hover:bg-yellow-200 hover:text-black" },
    auto_approved: { label: "Aprobado (Auto)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    auto_rejected: { label: "Rechazado (Auto)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
    admin_approved: { label: "Aprobado (Admin)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    admin_rejected: { label: "Rechazado (Admin)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
} as const

export const columns: ColumnDef<ParkingTicket>[] = [
    // {
    //     accessorKey: "driver_id",
    //     header: () => <div className="w-0 hidden text-center">ID Conductor</div>,
    //     cell: ({ row }) => (
    //         <div className="hidden text-center text-xs">
    //             {row.original.driver_id}
    //         </div>
    //     ),
    // },
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
                {row.original.vehicle_number}
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
        accessorKey: "parsed_data.location",
        header: () => <div className="text-center">Ubicación</div>,
        cell: ({ row }) => (
            <div className="text-center text-xs">
                {row.original.parsed_data.location || "No disponible"}
            </div>
        ),
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
] 