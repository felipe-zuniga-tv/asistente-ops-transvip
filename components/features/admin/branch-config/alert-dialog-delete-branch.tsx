'use client'

import { useToast } from '@/hooks/use-toast'
import { deleteBranch } from '@/lib/features/admin'
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
import type { Branch } from '@/types/domain/admin/types'
import { toast } from "sonner";

interface AlertDialogDeleteBranchProps {
    branch: Branch | null
    onOpenChange: (open: boolean) => void
    onSuccess: (branchId: string) => void
}

export function AlertDialogDeleteBranch({
    branch,
    onOpenChange,
    onSuccess,
}: AlertDialogDeleteBranchProps) {
    const { toast } = useToast()

    const handleDelete = async () => {
        if (!branch || !branch.id) return

        try {
            await deleteBranch(branch.id)
            toast({
                title: 'Éxito',
                description: 'Sucursal eliminada exitosamente',
            })
            onSuccess(branch.id)
            onOpenChange(false)
        } catch (error) {
            console.error('Error deleting branch:', error)
            toast({
                title: 'Error',
                description: 'Error al eliminar la sucursal',
                variant: 'destructive',
            })
        }
    }

    if (!branch) return null

    return (
        <AlertDialog open={!!branch} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la
                        sucursal {branch.name} ({branch.code}).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 