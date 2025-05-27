'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { useAuth } from '@/lib/providers/auth-provider'
import { Routes } from '@/utils/routes'
import { LoadingMessage } from '@/components/features/chat/message'

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading, isLogged } = useAuth()

    useEffect(() => {
        if (!isLoading && (!user || !isLogged)) {
            redirect(Routes.LOGIN)
        }
    }, [user, isLoading, isLogged])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoadingMessage text="Cargando..." />
            </div>
        )
    }

    return <>{children}</>
}