'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { PaymentMethod } from '@/lib/types/admin'

interface UsePaymentMethodDialogProps {
    onSuccess?: () => void
}

export function usePaymentMethodDialog({ onSuccess }: UsePaymentMethodDialogProps = {}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null)
    const [paymentMethodToEdit, setPaymentMethodToEdit] = useState<PaymentMethod | null>(null)
    const router = useRouter()

    const handleEdit = useCallback((paymentMethod: PaymentMethod) => {
        setPaymentMethodToEdit(paymentMethod)
        setIsDialogOpen(true)
    }, [])

    const handleDialogClose = useCallback((open: boolean) => {
        setIsDialogOpen(open)
        if (!open) {
            setPaymentMethodToEdit(null)
        }
    }, [])

    const handleDelete = useCallback((method: PaymentMethod | null) => {
        setPaymentMethodToDelete(method)
    }, [])

    const handleSuccess = useCallback(() => {
        setTimeout(() => {
            router.refresh()
        }, 250)
        onSuccess?.()
    }, [router, onSuccess])

    return {
        isDialogOpen,
        paymentMethodToDelete,
        paymentMethodToEdit,
        setIsDialogOpen,
        handleEdit,
        handleDialogClose,
        handleDelete,
        handleSuccess
    }
} 