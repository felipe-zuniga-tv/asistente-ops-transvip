"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VehicleStatus } from "@/lib/types";

interface AlertDialogDeleteStatusProps {
    status: VehicleStatus | null;
    onOpenChange: (open: boolean) => void;
    onDelete: (status: VehicleStatus) => void;
}

export function AlertDialogDeleteStatus({
    status,
    onOpenChange,
    onDelete,
}: AlertDialogDeleteStatusProps) {
    if (!status) return null;

    return (
        <AlertDialog open={!!status} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará el estado del móvil {status.vehicle_number} y no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => onDelete(status)}
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 