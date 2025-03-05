'use client'

import { Button } from "@/components/ui/button"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DriverSession } from "@/types"
import { clearDriverSession } from "@/lib/driver/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DriverHeaderProps {
	session: DriverSession
}

export function DriverHeader({ session }: DriverHeaderProps) {
	const router = useRouter()

	async function handleLogout() {
		await clearDriverSession()
		router.push('/login')
	}

	return (
		<header className="border-b">
			<div className="container mx-auto h-16 flex items-center justify-between">
				<Link href="/driver-access/dashboard" className="flex items-center gap-2">
					<TransvipLogo colored={true} size={24} />
					<span className="font-semibold">Parking Tickets</span>
				</Link>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							{session.full_name}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href="/driver-access/tickets/parking/history">
								My Tickets
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-red-600"
							onClick={handleLogout}
						>
							Logout
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
} 