import { useState } from 'react'
import { type PaymentMethod } from '@/lib/types/payment-method'

export function usePaymentMethodDialog() {
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<PaymentMethod | null>(null)
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null)

    const handleEdit = (method: PaymentMethod) => {
        setPaymentMethodToEdit(method)
        setIsEditDialogOpen(true)
    }

    const handleEditDialogClose = (open: boolean) => {
        setIsEditDialogOpen(open)
        if (!open) setPaymentMethodToEdit(null)
    }

    const handleNewDialogClose = (open: boolean) => {
        setIsNewDialogOpen(open)
    }

    const handleDelete = (method: PaymentMethod | null) => {
        setPaymentMethodToDelete(method)
    }

    const handleSuccess = () => {
        setIsNewDialogOpen(false)
        setIsEditDialogOpen(false)
        setPaymentMethodToEdit(null)
        setPaymentMethodToDelete(null)
    }

    return {
        isNewDialogOpen,
        isEditDialogOpen,
        paymentMethodToEdit,
        paymentMethodToDelete,
        setIsNewDialogOpen,
        handleEdit,
        handleEditDialogClose,
        handleNewDialogClose,
        handleDelete,
        handleSuccess
    }
} 