"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, Search } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import type { ParkingTicket } from "@/types"
import { 
    SimpleDialog,
    SimpleDialogHeader,
    SimpleDialogTitle
} from "@/components/ui/simple-dialog"
import { useState } from "react"

export const statusMap = {
    pending_review: { label: "Pendiente", variant: "warning", className: "bg-yellow-100 text-black hover:bg-yellow-200 hover:text-black" },
    auto_approved: { label: "Aprobado (Auto)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    auto_rejected: { label: "Rechazado (Auto)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
    admin_approved: { label: "Aprobado (Admin)", variant: "success", className: "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800" },
    admin_rejected: { label: "Rechazado (Admin)", variant: "destructive", className: "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-800" },
} as const

// Create a reusable image viewer component
const TicketImageViewer = ({ imageUrl }: { imageUrl: string }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    const handleOpen = () => setIsOpen(true)
    const handleClose = () => setIsOpen(false)
    
    return (
        <>
            <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleOpen}
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Ver ticket</span>
            </Button>
            
            <SimpleDialog 
                isOpen={isOpen} 
                onClose={handleClose}
                className="sm:max-w-md flex flex-col items-center justify-center p-4"
            >
                <div className="overflow-hidden mt-4">
                    <img 
                        src={imageUrl} 
                        alt="Ticket de estacionamiento" 
                        className="h-[420px] w-auto object-contain"
                    />
                </div>
            </SimpleDialog>
        </>
    )
}

export const columns: ColumnDef<ParkingTicket>[] = [
    {
        accessorKey: "driver_id",
        header: () => <div className="hidden text-center">ID Conductor</div>,
        cell: ({ row }) => (
            <div className="hidden text-center text-sm">
                {row.original.driver_id}
            </div>
        ),
    },
    {
        accessorKey: "booking_id",
        header: () => <div className="text-center"># Reserva</div>,
        cell: ({ row }) => (
            <div className="text-center text-sm">
                {row.original.booking_id}
            </div>
        ),
    },
    {
        accessorKey: "parsed_data.nro_boleta",
        header: () => <div className="text-center">N° Boleta</div>,
        cell: ({ row }) => (
            <div className="text-center text-sm">
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
                        <div className="text-center text-sm">
                            {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                    )
                } catch (error) {
                    return (
                        <div className="text-center text-sm text-muted-foreground">
                            {entryDate} {entryTime}
                        </div>
                    )
                }
            }
            
            return (
                <div className="text-center text-sm text-muted-foreground">
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
                        <div className="text-center text-sm">
                            {format(dateTime, "dd/MM/yyyy HH:mm", { locale: es })}
                        </div>
                    )
                } catch (error) {
                    return (
                        <div className="text-center text-sm text-muted-foreground">
                            {exitDate} {exitTime}
                        </div>
                    )
                }
            }
            
            return (
                <div className="text-center text-sm text-muted-foreground">
                    No disponible
                </div>
            )
        },
    },
    {
        accessorKey: "parsed_data.location",
        header: () => <div className="text-center">Ubicación</div>,
        cell: ({ row }) => (
            <div className="text-center text-sm">
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
                <div className="text-center text-sm">
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
                <div className="text-center text-sm">
                    <Badge className={config.className}>
                        {config.label}
                    </Badge>
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
                    <div className="text-center text-sm text-muted-foreground">
                        No disponible
                    </div>
                )
            }
            
            return (
                <div className="text-center">
                    <TicketImageViewer imageUrl={imageUrl} />
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className="hidden text-center">Acciones</div>,
        cell: ({ row, table }) => {
            const ticket = row.original

            return (
                <div className="hidden text-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                            {table.options.meta?.onEdit && (
                                <DropdownMenuItem onClick={() => table.options.meta?.onEdit?.(ticket)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {table.options.meta?.onDelete && (
                                <DropdownMenuItem
                                    onClick={() => table.options.meta?.onDelete?.(ticket)}
                                    className="text-destructive"
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
] 