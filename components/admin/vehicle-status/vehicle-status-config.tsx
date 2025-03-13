"use client";

import { useState } from "react";
import { VehicleStatusConfigDataTable } from "./table/vehicle-status-config-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { StatusConfigDialog } from "./status-config-dialog";
import { AlertDialogDeleteStatusConfig } from "./delete-status-config-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatusConfig } from "@/lib/services/database/actions";
import type { VehicleStatusConfig as VehicleStatusConfigType } from "@/lib/core/types/vehicle/status";
import { ConfigCardContainer } from "@/components/tables/config-card-container";

interface VehicleStatusConfigProps {
    configs?: VehicleStatusConfigType[];
}

export function VehicleStatusConfig({ configs = [] }: VehicleStatusConfigProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [configToDelete, setConfigToDelete] = useState<VehicleStatusConfigType | null>(null);
    const [configToEdit, setConfigToEdit] = useState<VehicleStatusConfigType | null>(null);

    const handleDeleteConfig = async (config: VehicleStatusConfigType) => {
        try {
            await deleteVehicleStatusConfig(config.id);
            router.refresh();
            toast.success("Estado eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting config:', error);
            toast.error("Error al eliminar el estado");
        }
    };

    const handleEdit = (config: VehicleStatusConfigType) => {
        setConfigToEdit(config);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setConfigToEdit(null);
    };

    return (
        <ConfigCardContainer title="Estados de Vehículos" 
            onAdd={() => setIsDialogOpen(true)}
            className="max-w-full"
        >
            <VehicleStatusConfigDataTable
                columns={columns}
                data={configs}
                onDelete={(config) => setConfigToDelete(config)}
                onEdit={handleEdit}
            />

            <StatusConfigDialog
                config={configToEdit}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <AlertDialogDeleteStatusConfig
                config={configToDelete}
                onOpenChange={(open) => setConfigToDelete(open ? configToDelete : null)}
                onDelete={handleDeleteConfig}
            />
        </ConfigCardContainer>
    );
} 