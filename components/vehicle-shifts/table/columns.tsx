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
        header: () => <div className="text-center"># Móvil</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("vehicle_number")}</div>,
    },
    {
        accessorKey: "shift_name",
        header: () => <div className="text-center">Turno</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("shift_name")}</div>,
    },
    {
        accessorKey: "start_date",
        header: () => <div className="text-center">Fecha Inicio</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {format(new Date(row.getValue("start_date")), "dd/MM/yyyy")}
            </div>
        ),
    },
    {
        accessorKey: "end_date",
        header: () => <div className="text-center">Fecha Fin</div>,
        cell: ({ row }) => (
            <div className="text-center">
                {format(new Date(row.getValue("end_date")), "dd/MM/yyyy")}
            </div>
        ),
    },
    {
        accessorKey: "priority",
        header: () => <div className="text-center">Prioridad</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("priority")}</div>,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row, table }) => {
            const assignment = row.original
            const { onEdit, onDelete } = table.options.meta || {}

            return (
                <div className="text-center">
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
                </div>
            )
        },
    },
]
