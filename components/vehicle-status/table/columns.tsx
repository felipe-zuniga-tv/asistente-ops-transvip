"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MoreHorizontal, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VehicleStatus } from "@/lib/types";

export const columns: ColumnDef<VehicleStatus>[] = [
    {
        accessorKey: "vehicle_number",
        header: "Móvil",
    },
    {
        accessorKey: "status_label",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.original;
            return (
                <div className="flex items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.status_color }}
                    />
                    <span>{status.status_label}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "start_date",
        header: "Fecha Inicio",
        cell: ({ row }) => format(new Date(row.original.start_date), "dd/MM/yyyy", { locale: es }),
    },
    {
        accessorKey: "end_date",
        header: "Fecha Fin",
        cell: ({ row }) => format(new Date(row.original.end_date), "dd/MM/yyyy", { locale: es }),
    },
    {
        accessorKey: "comments",
        header: "Comentarios",
        cell: ({ row }) => row.original.comments || "-",
    },
    {
        accessorKey: "created_at",
        header: "Creado",
        cell: ({ row }) => format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm", { locale: es }),
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const status = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => table.options.meta?.onEdit?.(status)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => table.options.meta?.onDelete?.(status)}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]; 