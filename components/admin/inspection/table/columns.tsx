"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import type { InspectionQuestion } from "@/lib/types/vehicle/inspection";

interface ColumnsProps {
    onEdit: (question: InspectionQuestion) => void;
    onDelete: (question: InspectionQuestion) => void;
}

export const columns = ({ onEdit, onDelete }: ColumnsProps): ColumnDef<InspectionQuestion>[] => [
    {
        accessorKey: "order",
        header: "Orden",
        cell: ({ row }) => <span className="font-medium">{row.getValue("order")}</span>,
    },
    {
        accessorKey: "label",
        header: "Pregunta",
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            return (
                <Badge variant="secondary">
                    {type === "text" && "Texto"}
                    {type === "number" && "Número"}
                    {type === "image" && "Imagen"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "allow_gallery_access",
        header: "Acceso a Galería",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const allowGallery = row.getValue("allow_gallery_access") as boolean;
            
            if (type !== "image") return null;
            
            return (
                <Badge variant={allowGallery ? "default" : "destructive"}>
                    {allowGallery ? "Permitido" : "No Permitido"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "is_active",
        header: "Estado",
        cell: ({ row }) => {
            const isActive = row.getValue("is_active") as boolean;
            return (
                <Badge variant={isActive ? "default" : "destructive"}>
                    {isActive ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(row.original)}
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(row.original)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            );
        },
    },
]; 