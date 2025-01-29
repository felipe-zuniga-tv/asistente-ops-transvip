'use client'

import { type PaymentMethod } from '@/lib/types/admin'
import { PaymentMethodDataTable } from './table/payment-method-data-table'
import { columns } from './table/columns'
import { PaymentMethodDialog } from './payment-method-dialog'
import { AlertDialogDeletePaymentMethod } from './alert-dialog-delete-payment-method'
import { usePaymentMethodDialog } from '@/lib/hooks/use-payment-method-dialog'
import { ConfigCardContainer } from '@/components/tables/config-card-container'

interface PaymentMethodConfigProps {
    data: PaymentMethod[]
}

export function PaymentMethodConfig({ data }: PaymentMethodConfigProps) {
    const {
        isDialogOpen,
        paymentMethodToDelete,
        paymentMethodToEdit,
        setIsDialogOpen,
        handleEdit,
        handleDialogClose,
        handleDelete,
        handleSuccess
    } = usePaymentMethodDialog()

    return (
        <ConfigCardContainer title="Métodos de Pago"
            onAdd={() => setIsDialogOpen(true)}
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
                onSuccess={handleSuccess}
            />

            <AlertDialogDeletePaymentMethod
                method={paymentMethodToDelete}
                onOpenChange={(open) => !open && handleDelete(null)}
                onSuccess={handleSuccess}
            />
        </ConfigCardContainer>
    )
} 