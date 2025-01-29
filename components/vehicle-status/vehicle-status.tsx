"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NewStatusDialog } from "./new-status-dialog";
import { EditStatusDialog } from "./edit-status-dialog";
import { VehicleStatusDataTable } from "./table/vehicle-status-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteStatus } from "./delete-status-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatus } from "@/lib/database/actions";
import type { VehicleStatus } from "@/lib/types";
import { AddButton } from "../ui/buttons";
import { CardTitleContent } from "../ui/card-title-content";

interface VehicleStatusProps {
    statuses?: VehicleStatus[];
}

export function VehicleStatus({ statuses = [] }: VehicleStatusProps) {
    const router = useRouter();
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    // const [showFilters, setShowFilters] = useState(false);
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
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <CardTitleContent title="Estado por Móvil" />
                    <AddButton
                        text="Añadir Estado"
                        onClick={() => setIsNewDialogOpen(true)}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
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
            </CardContent>
        </Card>
    );
} 