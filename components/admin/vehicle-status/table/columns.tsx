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
import type { VehicleStatusConfig } from "@/lib/types/vehicle/status";

export const columns: ColumnDef<VehicleStatusConfig>[] = [
    {
        accessorKey: "label",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const config = row.original;
            return (
                <div className="flex justify-center items-center gap-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                    />
                    <span>{config.label}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="text-center">Descripción</div>,
        cell: ({ row }) => <div className="text-center">{row.original.description || "-"}</div>,
    },
    {
        accessorKey: "color",
        header: () => <div className="text-center">Color</div>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: row.original.color }}
                />
                <span>{row.original.color.toUpperCase()}</span>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ table, row }) => {
            const config = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.onEdit?.(config)}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.onDelete?.(config)}
                            className="text-red-600"
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