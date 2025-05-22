import { EmptyState } from "@/components/ui/empty-state"
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container"
import { ParkingTicketsDataTable } from "@/components/features/finance/tickets/table/parking-tickets-data-table"
import { adminColumns } from "@/components/features/finance/tickets/admin-table/columns"
import { getAllParkingTickets } from "@/lib/features/tickets"

async function ParkingTicketsContent() {
	const parkingTickets = await getAllParkingTickets()

	return parkingTickets.length > 0 ? (
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
	)
}

export default async function ParkingTicketsAdmin() {
	return (
		<ConfigCardContainer
			title="Tickets de Estacionamiento"
			className="w-full max-w-full mx-0"
		>
			<ParkingTicketsContent />
		</ConfigCardContainer>
	)
}