import { logout } from "@/lib/lib"
import { Routes } from "@/utils/routes"
import { redirect } from "next/navigation"
import { Button } from "../ui/button"
import { LogOutIcon } from "lucide-react"

export default function LogoutButton({ ...props }) {
    const handleLogout = async () => {
		'use server'
		await logout()

		redirect(Routes.HOME)
	}

    return (
        <form action={handleLogout} {...props}>
            <Button>
                <LogOutIcon className="mr-2 h-4 w-4" /> Salir
            </Button>
        </form>
    )
}