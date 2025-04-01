import { TransvipLogo } from '@/components/transvip/transvip-logo'
import { getDriverSession } from '@/lib/features/driver/auth'
import { LogoutButton } from './logout-button'

export async function DriverNavbar() {
	// Try to get the driver session
	let driverSession = null
	
	try {
		driverSession = await getDriverSession()
	} catch (error) {
		// Session doesn't exist or is invalid
	}

	return (
		<nav className="w-full bg-white shadow-sm p-2 md:p-4">
			<div className="flex justify-between items-center max-w-7xl mx-auto px-2">
				<div className="flex items-center space-x-2">
					<TransvipLogo colored={true} size={18} className="md:hidden" />
					<TransvipLogo colored={true} size={24} className="hidden md:block" />
					<span className="font-semibold text-sm md:text-lg whitespace-nowrap">Portal Conductores</span>
				</div>
				{driverSession && (
					<div className="flex items-center gap-1 md:gap-2">
						<span className="text-xs md:text-sm text-gray-600 truncate max-w-[120px] md:max-w-none">
							{driverSession.full_name}
						</span>
						<span className="hidden md:block text-gray-300">·</span>
						<LogoutButton />
					</div>
				)}
			</div>
		</nav>
	)
} 