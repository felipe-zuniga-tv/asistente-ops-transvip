'use client'

import { logout } from "@/lib/core/auth"
import { Routes } from "@/utils/routes"
import { redirect } from "next/navigation"
import { Button } from "../ui/button"
import { LogOutIcon } from "lucide-react"

interface LogoutButtonProps {
    className?: string
}

export default function LogoutButton({ className, ...props }: LogoutButtonProps) {
    const handleLogout = async () => {
        try {
            await logout()
            return redirect(Routes.HOME)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Button aria-label="Logout" onClick={handleLogout} className="flex flex-row items-center gap-2 text-sm">
            <span className="">Salir</span>
            <LogOutIcon className="h-4 w-4" />
        </Button>
    )
}
