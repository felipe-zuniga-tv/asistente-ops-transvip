'use client'

import { type PaymentMethod } from '@/lib/types/payment-method'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PaymentMethodDataTable } from './data-table'
import { NewPaymentMethodDialog } from './new-payment-method-dialog'
import { EditPaymentMethodDialog } from './edit-payment-method-dialog'
import { DeletePaymentMethodDialog } from './delete-payment-method-dialog'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { usePaymentMethodDialog } from '@/hooks/use-payment-method-dialog'

interface PaymentMethodConfigProps {
    data: PaymentMethod[]
}

export function PaymentMethodConfig({ data }: PaymentMethodConfigProps) {
    const {
        isNewDialogOpen,
        isEditDialogOpen,
        paymentMethodToDelete,
        paymentMethodToEdit,
        setIsNewDialogOpen,
        handleEdit,
        handleEditDialogClose,
        handleNewDialogClose,
        handleDelete,
        handleSuccess
    } = usePaymentMethodDialog()

    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Configuración de Métodos de Pago</CardTitle>
                    <Button
                        onClick={() => setIsNewDialogOpen(true)}
                        className="ml-auto"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <PaymentMethodDataTable
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <NewPaymentMethodDialog
                        open={isNewDialogOpen}
                        onOpenChange={handleNewDialogClose}
                        onSuccess={handleSuccess}
                    />

                    {paymentMethodToEdit && (
                        <EditPaymentMethodDialog
                            method={paymentMethodToEdit}
                            open={isEditDialogOpen}
                            onOpenChange={handleEditDialogClose}
                            onSuccess={handleSuccess}
                        />
                    )}

                    <DeletePaymentMethodDialog
                        method={paymentMethodToDelete}
                        onOpenChange={(open) => !open && handleDelete(null)}
                        onSuccess={handleSuccess}
                    />
                </div>
            </CardContent>
        </Card>
    )
} 