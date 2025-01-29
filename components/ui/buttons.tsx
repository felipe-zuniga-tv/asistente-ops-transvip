import { Spinner } from './loading'
import { Button } from './button'
import { PlusCircle, RotateCw } from 'lucide-react'

interface AuthButtonProps {
  text: string
}

interface LoadingButtonProps {
  text?: string
  small?: boolean
}

interface ResetButtonProps {
  handleReset: () => void
}

export function AuthButton({ text }: AuthButtonProps) {
    return (
        <Button variant={"default"} type="submit" className="auth-btn">
            <span>{text}</span>
        </Button>
    )
}

export function LoadingButton({ text = "", small = false }: LoadingButtonProps) {
    return (
        <button type="button" role="status" className={`${small ? 'auth-btn-small' : 'auth-btn'} ${text === '' ? '': 'flex flex-row gap-4 items-center'}`}>
            <span className={`${text === '' ? 'sr-only' : ''}`}>{text}</span>
            <Spinner size={small ? "SMALL" : "MEDIUM"} />
        </button>
    )
}

export function ResetButton({ handleReset }: ResetButtonProps) {
    return (
        <Button variant={"default"} size={"sm"} onClick={handleReset} className="ml-auto">
            <RotateCw className="w-4 h-4" />
            Reiniciar
        </Button>
    )
}

interface AddButtonProps {
    text?: string;
    onClick: () => void;
    className?: string;
}

export function AddButton({ text, onClick, className }: AddButtonProps) {
    return (
        <Button size="default" className={`bg-transvip hover:bg-transvip-dark ${className || ""}`} onClick={onClick}>
            <PlusCircle className="w-4 h-4" />
            {text || "Añadir"}
        </Button>
    )
}