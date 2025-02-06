"use client";

import { useEffect, useState } from "react";
import { VehicleTypesDataTable } from "./table/vehicle-types-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { VehicleTypeDialog } from "./vehicle-type-dialog";
import { AlertDialogDeleteVehicleType } from "./alert-dialog-delete-vehicle-type";
import { toast } from "sonner";
import { deleteVehicleType } from "@/lib/services/admin/index";
import type { VehicleType } from "@/lib/types/admin";
import { ConfigCardContainer } from "@/components/tables/config-card-container";

interface VehicleTypesConfigProps {
    data?: VehicleType[];
}

export function VehicleTypesConfig({ data = [] }: VehicleTypesConfigProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vehicleTypeToDelete, setVehicleTypeToDelete] = useState<VehicleType | null>(null);
    const [vehicleTypeToEdit, setVehicleTypeToEdit] = useState<VehicleType | null>(null);

    useEffect(() => {
        if (!isDialogOpen || !vehicleTypeToEdit) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = ";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, vehicleTypeToEdit]);

    const handleDeleteVehicleType = async (vehicleType: VehicleType) => {
        try {
            await deleteVehicleType(vehicleType.id);
            setTimeout(() => {
                router.refresh();
            }, 500);
            toast.success("Tipo de vehículo eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting vehicle type:', error);
            toast.error("Error al eliminar el tipo de vehículo");
        }
    };

    const handleEdit = (vehicleType: VehicleType) => {
        setVehicleTypeToEdit(vehicleType);
        setIsDialogOpen(true);
    };

    const handleDialogClose = (open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setVehicleTypeToEdit(null);
        }
    };

    return (
        <ConfigCardContainer title="Tipos de Vehículos"
            onAdd={() => setIsDialogOpen(true)}
        >
            <VehicleTypesDataTable
                columns={columns}
                data={data}
                onDelete={(vehicleType) => setVehicleTypeToDelete(vehicleType)}
                onEdit={handleEdit}
            />

            <VehicleTypeDialog
                vehicleType={vehicleTypeToEdit}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <AlertDialogDeleteVehicleType
                vehicleType={vehicleTypeToDelete}
                onOpenChange={(open) => setVehicleTypeToDelete(open ? vehicleTypeToDelete : null)}
                onDelete={handleDeleteVehicleType}
            />
        </ConfigCardContainer>
    );
} 