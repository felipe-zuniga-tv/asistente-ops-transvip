'use client'

import { useEffect, useState } from 'react'
import { type PaymentMethod } from '@/lib/types/admin'
import { PaymentMethodDataTable } from './table/payment-method-data-table'
import { columns } from './table/columns'
import { PaymentMethodDialog } from './payment-method-dialog'
import { AlertDialogDeletePaymentMethod } from './alert-dialog-delete-payment-method'
import { ConfigCardContainer } from '@/components/tables/config-card-container'
import { useRouter } from 'next/navigation'

interface PaymentMethodConfigProps {
    data: PaymentMethod[]
}

export function PaymentMethodConfig({ data }: PaymentMethodConfigProps) {
    const router = useRouter()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<PaymentMethod | null>(null)
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null)

    useEffect(() => {
        if (!isDialogOpen || !paymentMethodToEdit) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, paymentMethodToEdit]);

    const handleSuccess = () => {
        router.refresh()
    }

    const handleEdit = (method: PaymentMethod) => {
        setPaymentMethodToEdit(method)
        setIsDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setPaymentMethodToEdit(null)
    }

    const handleDelete = (method: PaymentMethod | null) => {
        setPaymentMethodToDelete(method)
    }

    return (
        <ConfigCardContainer title="Métodos de Pago" onAdd={() => setIsDialogOpen(true)}>
            <PaymentMethodDataTable
                columns={columns}
                data={data}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <PaymentMethodDialog
                method={paymentMethodToEdit}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <AlertDialogDeletePaymentMethod
                method={paymentMethodToDelete}
                onOpenChange={(open) => !open && handleDelete(null)}
                onSuccess={handleSuccess}
            />
        </ConfigCardContainer>
    )
} 