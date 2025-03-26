'use client' // Error boundaries must be Client Components

import { Button } from '@/components/ui/button'
import { Routes } from '@/utils/routes'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <main className="bg-main min-h-screen bg-cover bg-top flex flex-col items-center justify-center">
            <div className="p-24 rounded-xl text-lg bg-white/90 text-center gap-4 flex flex-col">
                <h1 className="text-xl font-semibold">¡Hola!</h1>
                <p className="text-lg font-normal">
                    Algo no salió bien...
                </p>
                <Link href={Routes.HOME} className="mt-4">
                    <Button className="w-full bg-transvip hover:bg-transvip-dark py-4 text-lg h-12">
                        Vuelve al inicio
                    </Button>
                </Link>
            </div>
        </main>
    )
}