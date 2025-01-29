'use client'

import { type PaymentMethod } from '@/lib/types/payment-method'
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
import { useToast } from '@/hooks/use-toast'

interface DeletePaymentMethodDialogProps {
    method: PaymentMethod | null
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function DeletePaymentMethodDialog({
    method,
    onOpenChange,
    onSuccess,
}: DeletePaymentMethodDialogProps) {
    const { toast } = useToast()

    const handleDelete = async () => {
        if (!method) return

        try {
            // Here you would add your API call to delete the payment method
            // await deletePaymentMethod(method.id)
            toast({
                title: 'Método de pago eliminado',
                description: 'El método de pago ha sido eliminado exitosamente.',
            })
            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un error al eliminar el método de pago.',
                variant: 'destructive',
            })
        }
    }

    return (
        <AlertDialog open={!!method} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el
                        método de pago {method?.name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
} 