import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
		<Card className="px-0">
			<CardHeader className="px-5">
				<CardTitle>Resumen de Ticket</CardTitle>
				<CardDescription className="text-xs text-muted-foreground">Puedes editar los datos si es necesario</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 px-5">
				{/* Create a 2-column grid layout */}
				<div className="flex flex-col gap-2">
					{/* Booking ID */}
					<FormField
						control={form.control}
						name="booking_id"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
								<FormLabel className="mb-0"># de Reserva</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Ingresa la reserva"
											type="number"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Boleta Number */}
					<FormField
						control={form.control}
						name="nro_boleta"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
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

					{/* Entry Date and Time */}
					<FormField
						control={form.control}
						name="entry_date"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Fecha Entrada</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Fecha de entrada (DD/MM/YYYY)"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="entry_time"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Hora Entrada</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Hora de entrada (HH:MM)"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					{/* Exit Date and Time */}
					<FormField
						control={form.control}
						name="exit_date"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Fecha Salida</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Fecha de salida (DD/MM/YYYY)"
											disabled={isPending}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</div>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="exit_time"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
								<FormLabel className="mb-0">Hora Salida</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Hora de salida (HH:MM)"
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center gap-4">
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

				{/* Confirmation checkbox */}
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-end space-x-3 space-y-0 py-1 mt-2">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isPending}
								/>
							</FormControl>
							<div className="space-y-1 leading-none w-40">
								<FormLabel className="text-xs">
									Confirmo que los datos extraídos son correctos
								</FormLabel>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	)
} 