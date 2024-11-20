'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SubmitButton } from '../ui/form-submit'
import { KeySquare, Mail } from 'lucide-react'
import { Routes } from '@/utils/routes'
import { login } from '@/lib/auth'

export function LoginFormClient() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('Form submitted');
        event.preventDefault()
        
        try {
            setIsLoading(true)
            setError(null)

            console.log(process.env)
            
            if (!process.env.API_BASE_URL || !process.env.API_ADMIN_LOGIN_ROUTE) {
                console.error('API configuration missing');
                return { status: 500, data: null, error: 'API configuration missing' }
            }

            const formData = new FormData(event.currentTarget)
            const email = formData.get("email")?.toString()
            const password = formData.get("password")?.toString()
    
            if (!email || !password) {
                return { status: 400, data: null, error: 'Missing credentials' }
            }
            
            console.log(`Logging in with email: ${email}`)
            const response = await login(email, password)
            console.log(response)

            if (!response) {
                throw new Error('No response from server')
            }

            if (response.error) {
                console.error('Login error details:', response.error)
                setError(`Error: ${response.error}`)
                return
            }

            switch (response.status) {
                case 200:
                    await new Promise(resolve => setTimeout(resolve, 500))
                    router.refresh()
                    router.push(Routes.START)
                    break
                case 201:
                    setError('¿Estás conectado a VPN?')
                    break
                case 401:
                    setError('Credenciales inválidas')
                    break
                default:
                    setError('Ocurrió un error. No se ha podido iniciar sesión.')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Error de conexión. Por favor intente nuevamente.')
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