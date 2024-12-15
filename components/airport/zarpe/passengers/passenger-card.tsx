import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ZarpePassenger } from "@/lib/airport/types"
import { AlertTriangle, MessageSquare } from "lucide-react"

const MINUTES_URGENT_ALERT = 13
const ENABLE_MESSAGE_TO_PASSENGER = false

export default function PassengerCard({ passenger }: { passenger: ZarpePassenger }) {
	return (
		<div className={`w-full p-3 rounded-xl text-lg border shadow-md flex justify-center items-center bg-orange-100/80 ${ENABLE_MESSAGE_TO_PASSENGER ? 'gap-6' : ''}`}>
			<div className="flex-grow">
				<div className="passenger-header">
					<div className="flex flex-row gap-2 items-center font-semibold text-xl">
						<span>{passenger.terminal}</span>
						<span>·</span>
						<span>Reserva:</span>
						<span>{passenger.booking}</span>
						<div className="ml-auto flex flex-row gap-2 items-center">
							<span className="font-semibold">En espera:</span>
							<span className={`font-normal ${passenger.minutos >= MINUTES_URGENT_ALERT ? 'text-red-500' : ''}`}>{passenger.minutos} min</span>
						</div>
					</div>
				</div>
				<Separator className="h-px my-3 bg-orange-300" />
				<div className="passenger-data text-gray-900">
					<div className="flex flex-row gap-2 items-center">
						<div className="flex flex-row gap-2 items-center">
							<span className="font-semibold">Nombre:</span>
							<span className="font-normal">{passenger.nombre}</span>
						</div>
						<span>·</span>
						<div className="flex flex-row gap-2 items-center">
							<span className="font-semibold">Comuna:</span>
							<span className="font-normal">{passenger.comuna}</span>
						</div>
					</div>
					<div className="flex flex-row gap-2 items-center">
						<div className="flex flex-row gap-2 items-center">
							<span className="font-semibold">Pasajeros:</span>
							<span className="font-normal">{passenger.total_pax}</span>
						</div>
					</div>
				</div>
			</div>
			{ ENABLE_MESSAGE_TO_PASSENGER && (
				<div className="flex flex-col items-center justify-center gap-2 h-full">
					<Button variant="outline" size="icon">
						<MessageSquare className="h-4 w-4" />
					</Button>
					{passenger.minutos > MINUTES_URGENT_ALERT && false && (
						<div className="flex items-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900 px-2 py-1 rounded-full">
							<AlertTriangle className="w-4 h-4 mr-1" />
							<span className="text-xs font-semibold">Urgente</span>
						</div>
					)}
				</div>
			)}
		</div>
	)
}