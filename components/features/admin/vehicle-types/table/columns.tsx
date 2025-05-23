"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { VehicleType } from "@/types/domain/admin/types";
import { cn } from '@/utils/ui';

export const columns: ColumnDef<VehicleType>[] = [
    {
        accessorKey: "name",
        header: () => <div className="text-center">Nombre</div>,
        cell: ({ row }) => <div className="text-center">{row.original.name}</div>,
    },
    {
        accessorKey: "code",
        header: () => <div className="text-center">Código</div>,
        cell: ({ row }) => <div className="text-center">{row.original.code}</div>,
    },
    {
        accessorKey: "pax_capacity",
        header: () => <div className="text-center">Capacidad (Pax)</div>,
        cell: ({ row }) => <div className="text-center">{row.original.passenger_capacity}</div>,
    },
    {
        accessorKey: "luggage_capacity",
        header: () => <div className="text-center">Maletas</div>,
        cell: ({ row }) => <div className="text-center">{row.original.luggage_capacity}</div>,
    },
    {
        accessorKey: "is_active",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => (
            <div className="text-center">
                <Badge
                    variant={row.original.is_active ? 'default' : 'secondary'}
                    className={cn("text-xs", row.original.is_active ? 'bg-green-700 hover:bg-green-800' : 'text-white bg-red-500 hover:bg-red-400')}
                >
                    {row.original.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
            </div>
        ),
    },
    {
        id: "actions",
        cell: ({ table, row }) => {
            const vehicleType = row.original;

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
                            onClick={() => table.options.meta?.onEdit?.(vehicleType)}
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => table.options.meta?.onDelete?.(vehicleType)}
                            className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20"
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