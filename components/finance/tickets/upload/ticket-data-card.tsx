import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TicketImagePreview } from "./ticket-image-preview"
import { ConfirmationValues } from "./schemas"

interface TicketDataCardProps {
	form: UseFormReturn<ConfirmationValues>
	imagePreview?: string
	isPending: boolean
	showImage: boolean
	setShowImage: (show: boolean) => void
	debugBookingId?: string
}

export function TicketDataCard({
	form,
	imagePreview,
	isPending,
	showImage,
	setShowImage,
	debugBookingId
}: TicketDataCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Datos del Ticket</CardTitle>
				<CardDescription>Información extraída del ticket. Puedes editar los campos si es necesario.</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{/* Create a 2-column grid layout */}
				<div className="flex flex-col gap-2">
					{/* Boleta Number */}
					<FormField
						control={form.control}
						name="nro_boleta"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[1fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Boleta Nº</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Número de boleta"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Entry Timestamp */}
					<FormField
						control={form.control}
						name="entry_timestamp"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[1fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Entrada</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Fecha y hora de entrada"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Exit Timestamp */}
					<FormField
						control={form.control}
						name="exit_timestamp"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[1fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Salida</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Fecha y hora de salida"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Amount */}
					<FormField
						control={form.control}
						name="amount"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[1fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Monto</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Monto en pesos"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Location */}
					<FormField
						control={form.control}
						name="location"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[1fr_3fr] items-center gap-4">
								<FormLabel className="mb-0 ">Ubicación</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Ubicación del estacionamiento"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>
				</div>

				{/* Toggle to show image */}
				<div className="flex items-center space-x-2 mt-4">
					<Switch id="show-image" checked={showImage} onCheckedChange={setShowImage} />
					<Label htmlFor="show-image">
						{showImage ? 'Ocultar imagen' : 'Mostrar imagen'}
					</Label>
				</div>

				{/* Debug info for booking_id */}
				{debugBookingId && (
					<div className="text-sm text-red-500 mt-2">
						<span className="font-medium">Debug ID:</span> {debugBookingId}
					</div>
				)}

				{/* Image preview */}
				{showImage && imagePreview && (
					<div className="mt-4">
						<TicketImagePreview
							imageUrl={imagePreview}
							height="200px"
							showRemoveButton={false}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	)
} 