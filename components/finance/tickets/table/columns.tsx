"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ParkingTicket } from "@/types"

const statusMap = {
    pending_review: { label: "Pendiente", variant: "warning" },
    auto_approved: { label: "Aprobado", variant: "success" },
    auto_rejected: { label: "Rechazado", variant: "destructive" },
    admin_approved: { label: "Aprobado", variant: "success" },
    admin_rejected: { label: "Rechazado", variant: "destructive" },
} as const

export const columns: ColumnDef<ParkingTicket>[] = [
    {
        accessorKey: "booking_id",
        header: "ID Reserva",
    },
    {
        accessorKey: "parsed_data.nro_boleta",
        header: "N° Boleta",
    },
    {
        accessorKey: "parsed_data.entry_timestamp",
        header: "Entrada",
        cell: ({ row }) => {
            const timestamp = row.getValue("parsed_data.entry_timestamp") as string
            return format(new Date(timestamp), "Pp", { locale: es })
        },
    },
    {
        accessorKey: "parsed_data.exit_timestamp",
        header: "Salida",
        cell: ({ row }) => {
            const timestamp = row.getValue("parsed_data.exit_timestamp") as string
            return format(new Date(timestamp), "Pp", { locale: es })
        },
    },
    {
        accessorKey: "parsed_data.amount",
        header: "Monto",
        cell: ({ row }) => {
            const amount = row.getValue("parsed_data.amount") as number
            const formatted = new Intl.NumberFormat("es-CL", {
                style: "currency",
                currency: "CLP",
            }).format(amount)
            return formatted
        },
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusMap
            const config = statusMap[status]
            return (
                <Badge variant={config.variant as any}>
                    {config.label}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const ticket = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table.options.meta?.onEdit && (
                            <DropdownMenuItem onClick={() => table.options.meta?.onEdit?.(ticket)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </DropdownMenuItem>
                        )}
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
            )
        },
    },
] 