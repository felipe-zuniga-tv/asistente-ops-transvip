'use client'

import { type PaymentMethod, type PaymentMethodFormData } from '@/lib/types/payment-method'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { PaymentMethodForm } from './payment-method-form'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

interface EditPaymentMethodDialogProps {
    method: PaymentMethod
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function EditPaymentMethodDialog({
    method,
    open,
    onOpenChange,
    onSuccess,
}: EditPaymentMethodDialogProps) {
    const { toast } = useToast()

    const handleSubmit = async (data: PaymentMethodFormData) => {
        try {
            // Here you would add your API call to update the payment method
            // await updatePaymentMethod(method.id, data)
            toast({
                title: 'Método de pago actualizado',
                description: 'El método de pago ha sido actualizado exitosamente.',
            })
            onSuccess()
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Hubo un error al actualizar el método de pago.',
                variant: 'destructive',
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Método de Pago</DialogTitle>
                </DialogHeader>
                <PaymentMethodForm
                    defaultValues={{
                        name: method.name,
                        code: method.code,
                        icon_name: method.icon_name,
                        description: method.description,
                        is_active: method.is_active,
                    }}
                    onSubmit={handleSubmit}
                    submitText="Actualizar"
                />
            </DialogContent>
        </Dialog>
    )
} 