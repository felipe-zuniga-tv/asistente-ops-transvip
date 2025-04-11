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
import type { VehicleStatusConfig } from "@/lib/core/types/vehicle/status";

interface AlertDialogDeleteStatusConfigProps {
    config: VehicleStatusConfig | null;
    onOpenChange: (open: boolean) => void;
    onDelete: (config: VehicleStatusConfig) => void;
}

export function AlertDialogDeleteStatusConfig({
    config,
    onOpenChange,
    onDelete,
}: AlertDialogDeleteStatusConfigProps) {
    if (!config) return null;

    return (
        <AlertDialog open={!!config} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el estado{" "}
                        <span className="font-semibold">{config.label}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onDelete(config)}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 