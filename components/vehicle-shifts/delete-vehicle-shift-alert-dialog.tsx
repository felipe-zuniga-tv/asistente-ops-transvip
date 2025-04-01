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
import { deleteVehicleShift } from "@/lib/features/shifts/actions"
import { useRouter } from "next/navigation"
import { VehicleShift } from "./vehicle-shifts"

interface AlertDialogDeleteVehicleShiftProps {
    assignment: VehicleShift | null
    onOpenChange: (open: boolean) => void
}

export function AlertDialogDeleteVehicleShift({
    assignment,
    onOpenChange,
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
            setTimeout(() => {
                window.location.reload();
            }, 100);
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
                        <div className="flex flex-col gap-2 text-black">
                            <span>Esta acción eliminará la siguiente asignación:</span>
                            <div className="p-3 bg-gray-100 rounded-md shadow-md flex flex-col gap-2">
                                <div className="flex flex-row items-center gap-1">
                                    <span className="font-semibold">Vehículo:</span>
                                    <span>{assignment?.vehicle_number}</span>
                                    <span className="px-2">·</span>
                                    <span className="font-semibold">Turno:</span>
                                    <span>{assignment?.shift_name}</span>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    <span className="font-semibold">Fecha Inicio:</span>
                                    <span>{assignment?.start_date}</span>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    <span className="font-semibold">Fecha Fin:</span>
                                    <span>{assignment?.end_date}</span>
                                </div>
                                <div className="flex flex-row items-center gap-1">
                                    <span className="font-semibold">Prioridad:</span>
                                    <span>{assignment?.priority}</span>
                                </div>
                            </div>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete}>
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}