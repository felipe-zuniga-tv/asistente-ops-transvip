'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { clearDriverSession } from '@/lib/features/driver/auth'
import { Routes } from '@/utils/routes'
export function LogoutButton() {
	const router = useRouter()

	const handleSignOut = async () => {
		await clearDriverSession()
		router.push(Routes.DRIVERS.HOME)
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleSignOut}
			className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
		>
			<LogOut size={16} />
			<span>Salir</span>
		</Button>
	)
} 