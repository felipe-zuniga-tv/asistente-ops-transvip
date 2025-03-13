'use client'

import { useEffect, useState } from 'react'
import { type PaymentMethod } from '@/lib/core/types/admin'
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
        if (!isDialogOpen || !paymentMethodToEdit || !paymentMethodToDelete) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, paymentMethodToEdit, paymentMethodToDelete]);

    const handleSuccess = () => {
        router.refresh()
        setPaymentMethodToDelete(null)
        setPaymentMethodToEdit(null)
        setIsDialogOpen(false)
    }

    const handleEdit = (method: PaymentMethod) => {
        setPaymentMethodToEdit(method)
        setPaymentMethodToDelete(null)
        setIsDialogOpen(true)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setPaymentMethodToEdit(null)
        setPaymentMethodToDelete(null)
    }

    const handleDelete = (method: PaymentMethod | null) => {
        setIsDialogOpen(false)
        setPaymentMethodToEdit(null)
        setPaymentMethodToDelete(method)
    }

    return (
        <ConfigCardContainer title="Métodos de Pago" 
            onAdd={() => setIsDialogOpen(true)}
            className="max-w-full"
        >
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