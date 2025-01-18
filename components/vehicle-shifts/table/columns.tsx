"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VehicleShift } from "../vehicle-shifts"
import { format } from "date-fns"

export const columns: ColumnDef<VehicleShift>[] = [
    {
        accessorKey: "vehicle_number",
        header: "# Móvil",
    },
    {
        accessorKey: "shift_name",
        header: "Turno",
    },
    {
        accessorKey: "start_date",
        header: "Fecha Inicio",
        cell: ({ row }) => format(new Date(row.getValue("start_date")), "dd/MM/yyyy"),
    },
    {
        accessorKey: "end_date",
        header: "Fecha Fin",
        cell: ({ row }) => format(new Date(row.getValue("end_date")), "dd/MM/yyyy"),
    },
    {
        accessorKey: "priority",
        header: "Prioridad",
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const assignment = row.original
            const { onEdit, onDelete } = table.options.meta || {}

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit?.(assignment)}>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => onDelete?.(assignment)}
                            className="text-destructive"
                        >
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
