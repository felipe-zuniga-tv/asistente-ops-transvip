import { redirect } from "next/navigation"
import { getDriverSession } from "@/lib/driver/auth"
import { getDriverTickets } from "@/lib/features/tickets"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfigCardContainer } from "@/components/tables/config-card-container"
import { columns } from "@/components/finance/tickets/table/columns"
import { ParkingTicketsDataTable } from "@/components/finance/tickets/table/parking-tickets-data-table"
import UploadButton from "@/components/finance/tickets/upload/ticket-upload-button"

export default async function Dashboard() {
	const session = await getDriverSession()
	if (!session) {
		redirect('/conductores')
	}
	const parkingTickets = await getDriverTickets(session.driver_id, session.vehicle_number)

	return (
		<div className="flex-1 flex flex-col items-center justify-start p-4">
			<ConfigCardContainer
				title="Tickets de Estacionamiento"
				className="w-full max-w-full mx-0"
				headerContent={
					<UploadButton />
				}
			>
				{parkingTickets.length > 0 ? (
					<ParkingTicketsDataTable
						data={parkingTickets}
						columns={columns}
						initialPageSize={5}
					/>
				) : (
					<EmptyState
						title="No hay tickets aún"
						description="Envía tu primer ticket de estacionamiento para empezar"
						action={
							<UploadButton />
						}
					/>
				)}
			</ConfigCardContainer>
		</div>
	)
} 