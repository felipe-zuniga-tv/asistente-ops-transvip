"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteVehicleShift } from "@/lib/shifts/actions"
import { useRouter } from "next/navigation"
import { VehicleShift } from "./vehicle-shifts"

interface AlertDialogDeleteVehicleShiftProps {
    assignment: VehicleShift | null
    onOpenChange: (open: boolean) => void
    onDelete?: (assignment: VehicleShift) => void
}

export function AlertDialogDeleteVehicleShift({
    assignment,
    onOpenChange,
    onDelete,
}: AlertDialogDeleteVehicleShiftProps) {
    const router = useRouter()

    async function handleDelete() {
        if (!assignment?.id) return

        try {
            const result = await deleteVehicleShift(assignment.id)

            if (result.error) {
                throw new Error(result.error)
            }

            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error("Error:", error)
        }
    }

    return (
        <AlertDialog open={!!assignment} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción eliminará la asignación del vehículo {assignment?.vehicle_number} 
                        del turno {assignment?.shift_name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}