'use client'

import { useState } from 'react'
import { type PaymentMethod } from '@/lib/types/admin'
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
import { deletePaymentMethod } from '@/lib/services/admin'

interface AlertDialogDeletePaymentMethodProps {
    method: PaymentMethod | null
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function AlertDialogDeletePaymentMethod({
    method,
    onOpenChange,
    onSuccess,
}: AlertDialogDeletePaymentMethodProps) {
    const [isLoading, setIsLoading] = useState(false)

    async function handleDelete() {
        if (!method) return

        setIsLoading(true)
        try {
            await deletePaymentMethod(method.id)
            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Error deleting payment method:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={!!method} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el método
                        de pago &quot;{method?.name}&quot; del sistema.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 