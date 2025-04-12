import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { getDriverSession } from "@/lib/features/driver/auth"
import { getTicketById } from "@/lib/features/tickets"
import { 
	Badge,
	Button,
	Card, 
	CardContent, 
	CardHeader, 
	CardTitle 
} from "@/components/ui"
import { ArrowLeft } from "lucide-react"
import { Routes } from "@/utils/routes"

interface PageProps {
	params: {
		id: string
	}
}

export default async function TicketDetailPage({ params }: PageProps) {
	const session = await getDriverSession()
	if (!session) {
		redirect(Routes.DRIVERS.HOME)
	}
	const ticket = await getTicketById(params.id)

	if (!ticket || ticket.driver_id !== session.driver_id) {
		notFound()
	}

	const statusConfig = {
		pending_review: { label: "Pending Review", variant: "warning" },
		auto_approved: { label: "Approved", variant: "success" },
		auto_rejected: { label: "Rejected", variant: "destructive" },
		admin_approved: { label: "Approved", variant: "success" },
		admin_rejected: { label: "Rejected", variant: "destructive" },
	}

	const status = statusConfig[ticket.status]

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href={Routes.DRIVERS.TICKETS_DASHBOARD}>
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-bold">Detalles del Ticket</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Información del Ticket</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Estado</p>
								<Badge variant={status.variant as any} className="mt-1">
									{status.label}
								</Badge>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">ID Reserva</p>
								<p className="mt-1 font-medium">{ticket.booking_id}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">N° Boleta</p>
								<p className="mt-1 font-medium">{ticket.parsed_data.nro_boleta}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Monto</p>
								<p className="mt-1 font-medium">
									{new Intl.NumberFormat('es-CL', {
										style: 'currency',
										currency: 'CLP'
									}).format(ticket.parsed_data.amount)}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Hora de Entrada</p>
								<p className="mt-1 font-medium">
									{format(new Date(ticket.parsed_data.entry_date), 'PPp')} {ticket.parsed_data.entry_time}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Hora de Salida</p>
								<p className="mt-1 font-medium">
									{format(new Date(ticket.parsed_data.exit_date), 'PPp')} {ticket.parsed_data.exit_time}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Ubicación</p>
								<p className="mt-1 font-medium">{ticket.parsed_data.location}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Enviado</p>
								<p className="mt-1 font-medium">
									{format(new Date(ticket.submission_date), 'PPp')}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Imagen del Ticket</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
							<Image
								src="/placeholder-ticket.jpg" // TODO: Replace with actual image URL
								alt="Parking ticket"
								fill
								className="object-cover"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
} 