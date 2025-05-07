"use client";

import { useEffect, useState } from "react";
import { StatusDialog } from "./status-dialog";
import { VehicleStatusDataTable } from "./table/vehicle-status-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteStatus } from "./delete-status-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatus } from "@/lib/features/vehicle-status";
import type { VehicleStatus } from "@/lib/core/types";
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container";
import { getSession } from "@/lib/core/auth";

interface StatusConfig {
    id: string;
    label: string;
    color: string;
}

interface VehicleStatusProps {
    statuses?: VehicleStatus[];
    statusConfigs?: StatusConfig[];
}

export function VehicleStatus({ statuses = [], statusConfigs = [] }: VehicleStatusProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [statusToDelete, setStatusToDelete] = useState<VehicleStatus | null>(null);
    const [statusToEdit, setStatusToEdit] = useState<VehicleStatus | undefined>(undefined);

    useEffect(() => {
        if (!isDialogOpen || !statusToEdit) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, statusToEdit]);

    const handleDeleteStatus = async (status: VehicleStatus) => {
        try {
            // Get current user session and extract email
            const session = await getSession();
            // TypeScript doesn't know the structure so we use type assertion
            const userEmail = session ? (session as any).user?.email : null;
            
            // We need to modify the deleteVehicleStatus function to include the updated_by field
            await deleteVehicleStatus(status.id, userEmail);
            
            router.refresh();
            toast.success("Estado eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting status:', error);
            toast.error("Error al eliminar el estado");
        }
    };

    const handleEdit = (status: VehicleStatus) => {
        // Ensure status_id is a string when setting the state
        setStatusToEdit({
            ...status,
            status_id: String(status.status_id)
        });
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
                statusConfigs={statusConfigs}
            />

            <AlertDialogDeleteStatus
                status={statusToDelete}
                onOpenChange={(open) => setStatusToDelete(open ? statusToDelete : null)}
                onDelete={handleDeleteStatus}
            />
        </ConfigCardContainer>
    );
} 