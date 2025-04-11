// 'use client'
import { cn } from '@/utils/ui'
import { Button } from './button'
import { Spinner } from './loading'

interface PendingStateSpanProps {
    pendingState: string;
}

export function PendingStateSpan({ pendingState }: PendingStateSpanProps) {
    return (
        <span className="flex flex-row h-auto items-center gap-2">
            {pendingState} <Spinner />
        </span>
    )
}

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
  pendingState?: string;
}

export function SubmitButton({ 
  children, 
  isLoading = false, 
  pendingState = 'Cargando...', 
  className = "", 
  ...props 
}: SubmitButtonProps) {
    return (
        <Button {...props} variant="default" type='submit' disabled={isLoading} aria-disabled={isLoading}
            className={cn('text-base h-fit bg-transvip hover:bg-transvip-dark auth-btn', isLoading ? 'bg-gray-400' : '', className)}>
            {isLoading ? <PendingStateSpan pendingState={pendingState} /> : children}
        </Button>
    )
}