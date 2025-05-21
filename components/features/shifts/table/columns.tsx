"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, CircleCheck, CircleX, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Shift, WEEKDAYS } from "../shifts-definition";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const FORMAT_DATE = "dd/MM/yyyy HH:mm:ss"

declare module '@tanstack/table-core' {
    interface TableMeta<TData extends unknown> {
        onEdit?: (shift: TData) => void
        onDelete?: (shift: TData) => void
    }
}

export const columns: ColumnDef<Shift>[] = [
    {
        accessorKey: "branch_name",
        header: () => <div className="text-center">Sucursal</div>,
        cell: ({ row }) => <div className="text-center">{row.original.branch_name}</div>
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nombre
                        {column.getIsSorted() ? (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <div className="text-center">{row.original.name}</div>
    },
    {
        accessorKey: "start_time",
        header: () => <div className="text-center">Hora Inicio</div>,
        cell: ({ row }) => <div className="text-center">{row.original.start_time}</div>
    },
    {
        accessorKey: "end_time",
        header: () => <div className="text-center">Hora Fin</div>,
        cell: ({ row }) => <div className="text-center">{row.original.end_time}</div>
    },
    {
        accessorKey: "free_day",
        header: ({ column }) => {
            return (
                <div className="text-center">
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Día Libre
                        {column.getIsSorted() ? (column.getIsSorted() === "asc" ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
                    </Button>
                </div>
            )
        },
        filterFn: (row, columnId, filterValue: number[]) => {
            const freeDay = row.getValue(columnId) as number
            return filterValue.includes(freeDay)
        },
        cell: ({ row }) => {
            const weekday = WEEKDAYS.find(day => day.value === String(row.getValue("free_day")))
            return <div className="text-center">{weekday?.label || "-"}</div>
        }
    },
    {
        accessorKey: "anexo_2_signed",
        header: () => <div className="text-center">Anexo 2</div>,
        cell: ({ row }) => <div className="flex items-center justify-center">
            {row.original.anexo_2_signed ? 
                <CircleCheck className="size-5 shrink-0 text-green-500" /> :
                <CircleX className="size-5 shrink-0 text-red-500" />
            }
        </div>
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-center">Creado</div>,
        cell: ({ row }) => <div className="text-center">{format(row.original.created_timestamp, FORMAT_DATE)}</div>
    },
    {
        id: "actions",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row, table }) => {
            const shift = row.original;
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
                            <DropdownMenuItem onClick={() => table.options.meta?.onEdit?.(shift)}>
                                <Pencil className="h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => table.options.meta?.onDelete?.(shift)} 
                                className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20"
                            >
                                <Trash2 className="h-4 w-4" /> Borrar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    },
]