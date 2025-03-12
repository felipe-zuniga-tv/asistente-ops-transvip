import { Button } from "@/components/ui/button"
import { getDriverSession } from "@/lib/driver/auth"
import { getDriverTickets, getRecentDriverTickets } from "@/lib/tickets"
import { columns } from "@/components/finance/tickets/table/columns"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { redirect } from "next/navigation"
import { PlusCircle } from "lucide-react"
import { ParkingTicketsDataTable } from "@/components/finance/tickets/table/parking-tickets-data-table"
import { ConfigCardContainer } from "@/components/tables/config-card-container"

const UploadButton = () => {
	return (
		<Button variant="default" size={"default"} className="bg-transvip hover:bg-transvip/70" asChild>
			<Link href="/conductores/tickets/parking/upload">
			<PlusCircle className="h-4 w-4" />
			Subir Ticket
			</Link>
		</Button>
	)
}

export default async function Dashboard() {
	const session = await getDriverSession()
	if (!session) {
		redirect('/conductores/login')
	}
	// const recentTickets = await getRecentDriverTickets(session.driver_id, 5)
	const parkingTickets = await getDriverTickets(session.driver_id)

	return (
		<ConfigCardContainer 
			title="Tickets de Estacionamiento"
			className="w-full mx-0"
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
	)
} 