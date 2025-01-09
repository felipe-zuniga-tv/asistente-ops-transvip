import Link from 'next/link'
import { Routes } from '@/utils/routes'
import { Spinner } from './loading'
import { Button } from './button'
import { RotateCw } from 'lucide-react'

export function AuthButton({ text }) {
    return (
        <button type="submit" className="auth-btn">
            <span>{text}</span>
        </button>
    )
}

export function LoadingButton({ text = "", small = false }) {
    return (
        <button type="button" role="status" className={`${small ? 'auth-btn-small' : 'auth-btn'} ${text === '' ? '': 'flex flex-row gap-4 items-center'}`}>
            <span className={`${text === '' ? 'sr-only' : ''}`}>{text}</span>
            <Spinner size={small ? "SMALL" : "MEDIUM"} />
        </button>
    )
}

export function ResetButton({ handleReset }) {
    return (
        <Button variant={"default"} size={"sm"} onClick={handleReset} className="ml-auto">
            <RotateCw className="w-4 h-4" />
            Reiniciar
        </Button>
    )
}