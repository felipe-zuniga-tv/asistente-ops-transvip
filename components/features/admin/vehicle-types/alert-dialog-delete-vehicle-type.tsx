'use client'

import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { deleteVehicleType } from '@/lib/features/admin'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { VehicleType } from '@/types/domain/admin/types'
import { toast } from "sonner";

interface AlertDialogDeleteVehicleTypeProps {
    vehicleType: VehicleType | null
    onOpenChange: (open: boolean) => void
    onDelete: (vehicleType: VehicleType) => Promise<void>
}

export function AlertDialogDeleteVehicleType({
    vehicleType,
    onOpenChange,
    onDelete,
}: AlertDialogDeleteVehicleTypeProps) {
    const router = useRouter()
    const { toast } = useToast()

    const handleDelete = async () => {
        if (!vehicleType) return

        try {
            await deleteVehicleType(vehicleType.id)
            toast({
                title: 'Éxito',
                description: 'Tipo de vehículo eliminado exitosamente',
            })
            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error('Error deleting vehicle type:', error)
            toast({
                title: 'Error',
                description: 'Error al eliminar el tipo de vehículo',
                variant: 'destructive',
            })
        }
    }

    if (!vehicleType) return null

    return (
        <AlertDialog open={!!vehicleType} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el
                        tipo de vehículo {vehicleType.name} ({vehicleType.code}).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(vehicleType)}>
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 