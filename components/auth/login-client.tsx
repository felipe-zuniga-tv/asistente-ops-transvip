'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Routes } from '@/utils/routes'
import { login } from '@/lib/core/auth/functions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginFormClient() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData(event.currentTarget)
            const email = formData.get('email') as string
            const password = formData.get('password') as string

            if (!email || !email.includes('@')) {
                throw new Error('Por favor ingresa un email válido')
            }

            if (!password || password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres')
            }
            
            const loginResponse = await login(email, password)

            if (loginResponse && loginResponse.status === 200) {
                router.refresh()
                router.push(Routes.START)
            } else {
                throw new Error(loginResponse?.message || 'Credenciales inválidas')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err instanceof Error ? err.message : 'Error de conexión. Por favor intente nuevamente.')
        } finally {
            setIsLoading(false)
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
                    {isLoading ? "Verificando..." : "Continuar"}
                </Button>
            </form>
        </div>
    )
}