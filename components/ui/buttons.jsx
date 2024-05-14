import Link from 'next/link'
import { Routes } from '@/utils/routes'
import { Spinner } from './loading'

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