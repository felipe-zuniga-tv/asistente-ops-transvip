import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { createClient } from "@/utils/supabase/server"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfigCardContainer } from "@/components/tables/config-card-container"
import { ParkingTicketsDataTable } from "@/components/finance/tickets/table/parking-tickets-data-table"
import { ParkingTicket } from "@/types"
import { adminColumns } from "./columns"

// Function to get all parking tickets for the admin panel
async function getAllParkingTickets(): Promise<ParkingTicket[]> {
	const supabase = await createClient()
	
	const { data, error } = await supabase
		.from('parking_tickets')
		.select('*')
		.order('submission_date', { ascending: false })

	if (error) {
		throw new Error(`Failed to fetch tickets: ${error.message}`)
	}

	return data || []
}

export default async function ParkingTicketsAdmin() {
	const session = await getSession()
	if (!session || !session.user) {
		redirect('/login')
	}
	
	const parkingTickets = await getAllParkingTickets()

	return (
		<ConfigCardContainer
			title="Tickets de Estacionamiento"
			className="w-full max-w-full mx-0"
		>
			{parkingTickets.length > 0 ? (
				<ParkingTicketsDataTable
					data={parkingTickets}
					columns={adminColumns}
					initialPageSize={10}
				/>
			) : (
				<EmptyState
					title="No hay tickets aún"
					description="No hay tickets de estacionamiento pendientes de revisión"
				/>
			)}
		</ConfigCardContainer>
	)
}
