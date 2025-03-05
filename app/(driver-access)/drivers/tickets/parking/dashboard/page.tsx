import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getDriverSession } from "@/lib/driver/auth"
import { getRecentDriverTickets } from "@/lib/tickets"
import { DataTable } from "@/components/tables/data-table"
import { columns } from "@/components/finance/tickets/table/columns"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { redirect } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { ParkingTicketsDataTable } from "@/components/finance/tickets/table/parking-tickets-data-table"

export default async function Dashboard() {
	const session = await getDriverSession()
	if (!session) {
		redirect('/drivers/login')
	}
	const recentTickets = await getRecentDriverTickets(session.driver_id, 5)

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">Tickets de Estacionamiento</h1>
				<Button asChild>
					<Link href="/drivers/tickets/parking/upload">
						Subir Nuevo Ticket
					</Link>
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Últimos Envíos</CardTitle>
					<CardDescription>
						Tus 5 últimos envíos de tickets de estacionamiento
					</CardDescription>
				</CardHeader>
				<CardContent>
					{recentTickets.length > 0 ? (
						<ParkingTicketsDataTable
							data={recentTickets}
							columns={columns}
							initialPageSize={5}
						/>
					) : (
						<EmptyState
							title="No hay tickets aún"
							description="Envía tu primer ticket de estacionamiento para empezar"
							action={
								<Button asChild>
									<Link href="/drivers/tickets/parking/upload">
										Subir Ticket
									</Link>
								</Button>
							}
						/>
					)}
				</CardContent>
			</Card>
		</div>
	)
} 