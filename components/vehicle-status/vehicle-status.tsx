"use client";

import { useEffect, useState } from "react";
import { StatusDialog } from "./status-dialog";
import { VehicleStatusDataTable } from "./table/vehicle-status-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteStatus } from "./delete-status-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatus } from "@/lib/database/actions";
import type { VehicleStatus } from "@/lib/types";
import { ConfigCardContainer } from "../tables/config-card-container";

interface VehicleStatusProps {
    statuses?: VehicleStatus[];
}

export function VehicleStatus({ statuses = [] }: VehicleStatusProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<VehicleStatus | null>(null);
    const [statusToEdit, setStatusToEdit] = useState<VehicleStatus | undefined>(undefined);

    useEffect(() => {
        if (!isDialogOpen || !statusToEdit) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = ";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, statusToEdit]);

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
        setIsDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setStatusToEdit(undefined);
        }
    };

    return (
        <ConfigCardContainer title="Estado por Móvil" onAdd={() => setIsDialogOpen(true)} className="max-w-full">
            <VehicleStatusDataTable
                columns={columns}
                data={statuses}
                onDelete={(status) => setStatusToDelete(status)}
                onEdit={handleEdit}
            />

            <StatusDialog
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
                statusToEdit={statusToEdit}
            />

            <AlertDialogDeleteStatus
                status={statusToDelete}
                onOpenChange={(open) => setStatusToDelete(open ? statusToDelete : null)}
                onDelete={handleDeleteStatus}
            />
        </ConfigCardContainer>
    );
} 