"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Checkbox
} from "@/components/ui"
import { VehicleShift } from "@/components/features/vehicles/vehicle-shifts"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export const columns: ColumnDef<VehicleShift>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="text-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "vehicle_number",
        header: () => <div className="text-center"># Móvil</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("vehicle_number")}</div>,
        filterFn: (row, columnId, filterValue) => {
            const rowValue = String(row.getValue(columnId))
            return rowValue.toLowerCase().includes(String(filterValue).toLowerCase())
        }
    },
    {
        accessorKey: "branch_name",
        header: () => <div className="text-center">Sucursal</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("branch_name")}</div>,
    },
    {
        accessorKey: "shift_name",
        header: () => <div className="text-center">Turno</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("shift_name")}</div>,
    },
    {
        accessorKey: "start_date",
        header: () => <div className="text-center">Fecha Inicio</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue("start_date") + "T00:00:00");
            return (
                <div className="text-center">
                    {format(date, "dd/MM/yyyy", { locale: es })}
                </div>
            );
        },
    },
    {
        accessorKey: "end_date",
        header: () => <div className="text-center">Fecha Fin</div>,
        cell: ({ row }) => {
            const date = new Date(row.getValue("end_date") + "T00:00:00");
            return (
                <div className="text-center">
                    {format(date, "dd/MM/yyyy", { locale: es })}
                </div>
            );
        },
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
                                <Pencil className="h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete?.(assignment)}
                                className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20"
                            >
                                <Trash2 className="h-4 w-4" /> Borrar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]
