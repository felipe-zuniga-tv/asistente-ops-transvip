'use client'

import { useAuth } from '@/lib/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const { logout } = useAuth()

    return (
        <Button variant="default"
            size="default"
            onClick={() => logout()}
            aria-label="Cerrar sesión"
        >
            <LogOut className="h-5 w-5" />
            Salir
        </Button>
    )
}