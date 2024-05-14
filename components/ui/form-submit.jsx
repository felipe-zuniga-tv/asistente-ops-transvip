'use client'
import { useFormStatus } from 'react-dom'
import { Spinner } from './loading'
import { cn } from '@/lib/utils'

export function FormSubmit({ children, pendingState, className,...props }) {
    const { pending } = useFormStatus()

    return (
        <button disabled={pending} {...props} 
            className={cn(`${pending ? 'bg-gray-400' : 'bg-transvip'}`, className)}>
            { pending && pendingStateSpan({ pendingState }) }
            { !pending && children }
        </button>
    )
}

function pendingStateSpan({ pendingState }) {
    return (
        <span className="flex flex-row h-auto items-center gap-2">
            { pendingState } <Spinner />
        </span>
    )
}