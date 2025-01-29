'use client'

import { type PaymentMethodFormData } from '@/lib/types/payment-method'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { PaymentMethodForm } from './payment-method-form'
import { useToast } from '@/hooks/use-toast'

interface NewPaymentMethodDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function NewPaymentMethodDialog({
    open,
    onOpenChange,
    onSuccess,
}: NewPaymentMethodDialogProps) {
    const { toast } = useToast()

    const handleSubmit = async (data: PaymentMethodFormData) => {
        try {
            // Here you would add your API call to create the payment method
            // await createPaymentMethod(data)
            toast({
                title: 'Método de pago creado',
                description: 'El método de pago ha sido creado exitosamente.',
            })
            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un error al crear el método de pago.',
                variant: 'destructive',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Método de Pago</DialogTitle>
                </DialogHeader>
                <PaymentMethodForm
                    onSubmit={handleSubmit}
                    submitText="Crear"
                />
            </DialogContent>
        </Dialog>
    )
} 