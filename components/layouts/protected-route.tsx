'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/auth-provider'
import { Routes } from '@/utils/routes'
import { LoadingMessage } from '@/components/features/chat/message'

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push(Routes.LOGIN)
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoadingMessage text="Cargando..." />
            </div>
        )
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}