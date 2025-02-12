"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, MoreHorizontal, Eye, Power, Pencil } from "lucide-react";
import type { OperationsFormQuestion, OperationsForm } from "@/lib/types/vehicle/forms";
import { formatDate } from "@/utils/dates";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColumnsProps {
    handleView: (formId: string) => void;
    onToggleStatus?: (form: OperationsForm) => void;
    onEdit?: (form: OperationsForm) => void;
}

export const columns = ({ handleView, onToggleStatus, onEdit }: ColumnsProps): ColumnDef<OperationsForm>[] => [
    {
        accessorKey: "title",
        header: () => <div className="text-center">Título</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    {row.getValue("title")}
                </div>
            );
        },
    },
    {
        accessorKey: "description",
        header: () => <div className="text-center">Descripción</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center max-w-lg mx-auto truncate">
                    {row.getValue("description")}
                </div>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => {
            const isActive = row.getValue("is_active") as boolean;
            return (
                <div className="text-center">
                    <Badge 
                        variant={isActive ? "default" : "secondary"} 
                        className={isActive ? "bg-green-500" : "bg-red-500 text-white"}
                    >
                        {isActive ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "created_at",
        header: () => <div className="text-center">Fecha de Creación</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center">
                    {formatDate(row.getValue("created_at"))}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Acciones</div>,
        cell: ({ row }) => {
            const form = row.original;
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
                            <DropdownMenuItem onClick={() => handleView(form.id)}>
                                <Pencil className="h-4 w-4" />
                                <span>Editar preguntas</span>
                            </DropdownMenuItem>
                            {onEdit && (
                                <DropdownMenuItem onClick={() => onEdit(form)}>
                                    <Pencil className="h-4 w-4" />
                                    <span>Editar formulario</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleStatus?.(form)}>
                                <Power className="h-4 w-4" />
                                <span>{form.is_active ? 'Desactivar' : 'Activar'} formulario</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];