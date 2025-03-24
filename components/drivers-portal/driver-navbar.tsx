import { TransvipLogo } from '../transvip/transvip-logo'
import { getDriverSession } from '@/lib/driver/auth'
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
		<nav className="w-full bg-white shadow-sm p-4">
			<div className="flex justify-between items-center">
				<div className="flex items-center space-x-2">
					<TransvipLogo colored={true} size={24} />
					<span className="font-semibold text-lg">Portal Conductores</span>
				</div>
				{driverSession && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-gray-600">
							{driverSession.full_name}
						</span>
						<span>·</span>
						<LogoutButton />
					</div>
				)}
			</div>
		</nav>
	)
} 