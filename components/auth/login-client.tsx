'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from '@/lib/auth/actions'
import { SubmitButton } from '../ui/form-submit'

export function LoginFormClient() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const result = await loginAction(formData)

        if (result.success) {
            router.push(result.redirectTo)
        } else {
            setError(result.error || 'Ocurrió un error. Conectado a VPN?')
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full sm:max-w-md justify-center gap-4">
            <span className='mx-auto text-xl text-white'>Ingresa aquí</span>
            <form onSubmit={handleSubmit} method='POST' className="auth-form auth-widths">
                <input
                    type="email"
                    name="email"
                    className="auth-input-field"
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="password"
                    className="auth-input-field"
                    placeholder="Password"
                    required
                />

                <SubmitButton pendingState={'Ingresando...'} className='auth-btn' isLoading={isLoading}>
                    Ingresar
                </SubmitButton>

                {error && <div className="text-red-500 text-sm mt-2 p-2 text-center bg-white rounded-md">{error}</div>}
            </form>
        </div>
    )
}
