'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { clearDriverSession } from '@/lib/driver/auth'

export function LogoutButton() {
	const router = useRouter()

	const handleSignOut = async () => {
		await clearDriverSession()
		router.push('/conductores/login')
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleSignOut}
			className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
		>
			<LogOut size={16} />
			<span>Cerrar sesión</span>
		</Button>
	)
} 