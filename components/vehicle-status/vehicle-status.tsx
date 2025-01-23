"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { NewStatusDialog } from "./new-status-dialog";
import { EditStatusDialog } from "./edit-status-dialog";
import { VehicleStatusDataTable } from "./table/vehicle-status-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteStatus } from "./delete-status-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatus } from "@/lib/database/actions";
import type { VehicleStatus } from "@/lib/types";

interface VehicleStatusProps {
    statuses?: VehicleStatus[];
}

export function VehicleStatus({ statuses = [] }: VehicleStatusProps) {
    const router = useRouter();
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<VehicleStatus | null>(null);
    const [statusToEdit, setStatusToEdit] = useState<VehicleStatus | null>(null);

    const handleDeleteStatus = async (status: VehicleStatus) => {
        try {
            await deleteVehicleStatus(status.id);
            router.refresh();
            toast.success("Estado eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting status:', error);
            toast.error("Error al eliminar el estado");
        }
    };

    const handleEdit = (status: VehicleStatus) => {
        setStatusToEdit(status);
        setIsEditDialogOpen(true);
    };

    const handleEditDialogClose = (open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
            setStatusToEdit(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Switch checked={showFilters} onCheckedChange={setShowFilters} />
                    <Label>{showFilters ? "Ocultar" : "Mostrar"} Filtros</Label>
                </div>
                <Button size="default" className="text-xs md:text-sm" onClick={() => setIsNewDialogOpen(true)}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Estado
                </Button>
            </div>

            {showFilters && (
                <div className="mb-4 space-y-4 p-4 border rounded-md">
                    {/* TODO: Add filter components */}
                </div>
            )}

            <VehicleStatusDataTable
                columns={columns}
                data={statuses}
                onDelete={(status) => setStatusToDelete(status)}
                onEdit={handleEdit}
            />

            <NewStatusDialog
                open={isNewDialogOpen}
                onOpenChange={setIsNewDialogOpen}
            />

            {statusToEdit && (
                <EditStatusDialog
                    open={isEditDialogOpen}
                    onOpenChange={handleEditDialogClose}
                    status={statusToEdit}
                />
            )}

            <AlertDialogDeleteStatus
                status={statusToDelete}
                onOpenChange={(open) => setStatusToDelete(open ? statusToDelete : null)}
                onDelete={handleDeleteStatus}
            />
        </div>
    );
} 