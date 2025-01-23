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
        header: () => <div className="text-center">Móvil</div>,
        cell: ({ row }) => <div className="text-center">{row.original.vehicle_number}</div>,
    },
    {
        accessorKey: "status_label",
        header: () => <div className="text-center">Estado</div>,
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
        header: () => <div className="text-center">Fecha Inicio</div>,
        cell: ({ row }) => {
            const date = new Date(row.original.start_date);
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
            const date = new Date(row.original.end_date);
            return (
                <div className="text-center">
                    {format(date, "dd/MM/yyyy", { locale: es })}
                </div>
            );
        },
    },
    {
        accessorKey: "comments",
        header: () => <div className="text-center">Comentarios</div>,
        cell: ({ row }) => {
            const comments = row.original.comments;
            return (
                <div className="text-center">
                    {comments || <span className="text-muted-foreground text-sm">Sin comentarios</span>}
                </div>
            );
        }
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-center">Creado</div>,
        cell: ({ row }) => {
            const date = new Date(row.original.created_at);
            return (
                <div className="text-center">
                    {format(date, "dd/MM/yyyy HH:mm", { locale: es })}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row, table }) => {
            const status = row.original;

            return (
                <div className="flex justify-center">
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
                </div>
            );
        },
    },
]; 