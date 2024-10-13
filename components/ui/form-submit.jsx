'use client'
import { useFormStatus } from 'react-dom'
import { Spinner } from './loading'
import { cn } from '@/lib/utils'

export function FormSubmit({ children, pendingState, className, ...props }) {
    const { pending } = useFormStatus()
    console.log(pending)

    return (
        <button type='submit' disabled={pending} {...props} 
            className={cn(`${pending ? 'bg-gray-400' : 'bg-transvip'}`, className)}>
            { pending ? pendingStateSpan({ pendingState }) : children }
        </button>
    )
}

export function pendingStateSpan({ pendingState }) {
    return (
        <span className="flex flex-row h-auto items-center gap-2">
            { pendingState } <Spinner />
        </span>
    )
}

export function SubmitButton({ children, isLoading, pendingState, className, ...props }) {
    return (
        <button type='submit' disabled={isLoading} aria-disabled={isLoading}
            className={cn(`${isLoading ? 'bg-gray-400' : 'bg-transvip'}`, 'auth-btn')}>
            { isLoading ? pendingStateSpan({ pendingState }) : 'Ingresar' }
        </button>
    )
}