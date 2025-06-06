'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/lib/providers/auth-provider'
import { Loader2 } from 'lucide-react'

export function LoginFormClient() {
    const [error, setError] = useState<string | null>(null)
    const { login, isLoading } = useAuth()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !email.includes('@')) {
            throw new Error('Por favor ingresa un email válido')
        }

        if (!password || password.length < 6) {
            throw new Error('La contraseña debe tener al menos 6 caracteres')
        }
        try {
            await login(email, password)
        } catch (err) {
            console.error('Login error:', err)
            setError(err instanceof Error ? err.message : 'Error de conexión. Por favor intente nuevamente.')
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="usuario@email.com"
                        autoComplete="email"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ?
                        <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Verificando...</span> :
                        <span className="flex items-center gap-2">Continuar</span>
                    }
                </Button>
            </form>
        </div>
    )
}