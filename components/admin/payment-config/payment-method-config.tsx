'use client'

import { useState } from 'react'
import { type PaymentMethod } from '@/lib/types/admin'
import { PaymentMethodDataTable } from './table/payment-method-data-table'
import { columns } from './table/columns'
import { NewPaymentMethodDialog } from './new-payment-method-dialog'
import { EditPaymentMethodDialog } from './edit-payment-method-dialog'
import { AlertDialogDeletePaymentMethod } from './alert-dialog-delete-payment-method'
import { ConfigCardContainer } from '@/components/tables/config-card-container'
import { useRouter } from 'next/navigation'

interface PaymentMethodConfigProps {
    data: PaymentMethod[]
}

export function PaymentMethodConfig({ data }: PaymentMethodConfigProps) {
    const router = useRouter()
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<PaymentMethod | null>(null)
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null)

    const handleSuccess = () => {
        router.refresh()
    }

    const handleEdit = (method: PaymentMethod) => {
        setPaymentMethodToEdit(method)
        setIsEditDialogOpen(true)
    }

    const handleEditComplete = () => {
        setIsEditDialogOpen(false)
        setPaymentMethodToEdit(null)
    }

    const handleDelete = (method: PaymentMethod | null) => {
        setPaymentMethodToDelete(method)
    }

    return (
        <>
            <ConfigCardContainer 
                title="Métodos de Pago"
                onAdd={() => setIsNewDialogOpen(true)}
            >
                <PaymentMethodDataTable
                    columns={columns}
                    data={data}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </ConfigCardContainer>

            <NewPaymentMethodDialog
                open={isNewDialogOpen}
                onOpenChange={setIsNewDialogOpen}
            />

            <EditPaymentMethodDialog
                method={paymentMethodToEdit}
                open={isEditDialogOpen}
                onOpenChange={handleEditComplete}
            />

            <AlertDialogDeletePaymentMethod
                method={paymentMethodToDelete}
                onOpenChange={(open) => !open && handleDelete(null)}
                onSuccess={handleSuccess}
            />
        </>
    )
} 