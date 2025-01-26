"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { VehicleStatusConfigDataTable } from "./table/vehicle-status-config-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { NewStatusConfigDialog } from "./new-status-config-dialog";
import { EditStatusConfigDialog } from "./edit-status-config-dialog";
import { AlertDialogDeleteStatusConfig } from "./delete-status-config-alert-dialog";
import { toast } from "sonner";
import { deleteVehicleStatusConfig } from "@/lib/database/actions";
import { TransvipLogo } from '@/components/transvip/transvip-logo';
import type { VehicleStatusConfig as VehicleStatusConfigType } from "@/lib/types/vehicle/status";

interface VehicleStatusConfigProps {
    configs?: VehicleStatusConfigType[];
}

export function VehicleStatusConfig({ configs = [] }: VehicleStatusConfigProps) {
    const router = useRouter();
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [configToDelete, setConfigToDelete] = useState<VehicleStatusConfigType | null>(null);
    const [configToEdit, setConfigToEdit] = useState<VehicleStatusConfigType | null>(null);

    const handleDeleteConfig = async (config: VehicleStatusConfigType) => {
        try {
            await deleteVehicleStatusConfig(config.id);
            setTimeout(() => {
                router.refresh();
            }, 500);
            toast.success("Estado eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting config:', error);
            toast.error("Error al eliminar el estado");
        }
    };

    const handleEdit = (config: VehicleStatusConfigType) => {
        setConfigToEdit(config);
        setIsEditDialogOpen(true);
    };

    const handleEditDialogClose = (open: boolean) => {
        setIsEditDialogOpen(open);
        if (!open) {
            setConfigToEdit(null);
        }
    };

    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span>Configuración de Estados</span>
                    </div>
                    <Button size="default" className="text-xs md:text-sm" onClick={() => setIsNewDialogOpen(true)}>
                        <PlusCircle className="w-4 h-4" />
                        Añadir Estado
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <VehicleStatusConfigDataTable
                        columns={columns}
                        data={configs}
                        onDelete={(config) => setConfigToDelete(config)}
                        onEdit={handleEdit}
                    />

                    <NewStatusConfigDialog
                        open={isNewDialogOpen}
                        onOpenChange={setIsNewDialogOpen}
                    />

                    {configToEdit && (
                        <EditStatusConfigDialog
                            open={isEditDialogOpen}
                            onOpenChange={handleEditDialogClose}
                            config={configToEdit}
                        />
                    )}

                    <AlertDialogDeleteStatusConfig
                        config={configToDelete}
                        onOpenChange={(open) => setConfigToDelete(open ? configToDelete : null)}
                        onDelete={handleDeleteConfig}
                    />
                </div>
            </CardContent>
        </Card>
    );
} 