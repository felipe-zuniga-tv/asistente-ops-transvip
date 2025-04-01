import { redirect } from "next/navigation"
import { getDriverSession } from "@/lib/features/driver/auth"
import { getDriverTickets } from "@/lib/features/tickets"
import { TicketsDashboard } from "@/components/finance/tickets/dashboard"
import { Routes } from "@/utils/routes"

export default async function ParkingTicketsDashboardPage() {
	const session = await getDriverSession()
	if (!session) {
		redirect(Routes.DRIVERS.HOME)
	}

	const tickets = await getDriverTickets(session.driver_id)

	return (
		<div className="w-full max-w-screen-xl mx-auto p-4 flex flex-row items-center justify-center">
			<TicketsDashboard tickets={tickets} />
		</div>
	)
} 