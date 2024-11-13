'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/lib/auth/actions'
import { SubmitButton } from '../ui/form-submit'
import { KeySquare, Mail } from 'lucide-react'
import { login } from '@/lib/auth'
import { Routes } from '@/utils/routes'

export function LoginFormClient() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData(event.currentTarget)
            const { status, data } = await login(formData)

            if (status === 200 || status === 201) {
                router.push(Routes.START)
            } else {
                setError('Ocurrió un error. Conectado a VPN?')
            }
        } catch (err) {
            setError('Error de conexión. Por favor intente nuevamente.')
            console.error('Login error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full sm:max-w-md justify-center gap-4">
            <span className='mx-auto text-xl text-white'>Ingresa aquí</span>
            <form onSubmit={handleSubmit} method='POST' className="auth-form auth-widths">
                <div className="relative">
                    <input
                        type="email"
                        name="email"
                        className="auth-input-field"
                        placeholder="Email"
                        required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <Mail size={20} strokeWidth={2} aria-hidden="true" role="presentation" />
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="password"
                        name="password"
                        className="auth-input-field"
                        placeholder="Password"
                        required
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-3 text-muted-foreground/80 peer-disabled:opacity-50">
                        <KeySquare size={20} strokeWidth={2} aria-hidden="true" role="presentation" />
                    </div>
                </div>

                <SubmitButton pendingState={'Ingresando...'} className='auth-btn' isLoading={isLoading}>
                    Ingresar
                </SubmitButton>

                {error && <div className="text-red-500 text-sm mt-2 p-2 text-center bg-white rounded-md">{error}</div>}
            </form>
        </div>
    )
}