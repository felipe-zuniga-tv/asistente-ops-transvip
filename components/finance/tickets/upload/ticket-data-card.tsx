import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
	Button,
	Input,
	SimpleDialog, 
	FormControl, 
	FormField, 
	FormItem, 
	FormLabel, 
	FormMessage,
	Card, 
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Checkbox
} from "@/components/ui"
import { TicketImagePreview } from "./ticket-image-preview"
import { ConfirmationValues } from "./schemas"
import { cn } from "@/lib/utils"
import { Image as ImageIcon } from "lucide-react"

interface TicketDataCardProps {
	form: UseFormReturn<ConfirmationValues>
	imagePreview?: string
	isPending: boolean
	debugBookingId?: string
}

export function TicketDataCard({
	form,
	imagePreview,
	isPending,
	debugBookingId
}: TicketDataCardProps) {
	// Add state for the image dialog
	const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

	return (
		<Card className="px-0">
			<CardHeader className="px-5">
				<CardTitle className="flex items-center justify-between">
					<span>Resumen de Ticket</span>
					
					{/* Image Viewing Section */}
					<div className="flex items-center space-x-2">
						{imagePreview && (
							<Button
								variant="outline"
								size="sm"
								className="flex items-center gap-2 bg-transvip hover:bg-transvip/80 text-white hover:text-white"
								onClick={() => setIsImageDialogOpen(true)}
								disabled={isPending}
							>
								<ImageIcon className="h-4 w-4" />
								<span>Ver Ticket</span>
							</Button>
						)}
					</div>
				</CardTitle>
				<CardDescription className="text-xs text-muted-foreground">Puedes editar los datos si es necesario</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4 px-5">
				{/* Create a 2-column grid layout */}
				<div className="flex flex-col gap-1.5">
					{/* Booking ID */}
					<FormField
						control={form.control}
						name="booking_id"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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

					{/* Vehicle Number */}
					<FormField
						control={form.control}
						name="vehicle_number"
						render={({ field }) => (
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
								<FormLabel className="mb-0"># de Móvil</FormLabel>
								<div>
									<FormControl>
										<Input
											placeholder="Ingresa el número de móvil"
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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
							<FormItem className="space-y-0 grid grid-cols-[2fr_3fr] sm:grid-cols-[2fr_3fr] items-center">
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

				{/* Debug info for booking_id */}
				{debugBookingId && (
					<div className="text-sm text-red-500 mt-2">
						<span className="font-medium">Debug ID:</span> {debugBookingId}
					</div>
				)}

				{/* Image Dialog */}
				{imagePreview && (
					<SimpleDialog
						isOpen={isImageDialogOpen}
						onClose={() => setIsImageDialogOpen(false)}
						className="sm:max-w-md flex flex-col items-center justify-center p-4"
					>
						<TicketImagePreview
							imageUrl={imagePreview}
							height="400px"
							showRemoveButton={false}
						/>
					</SimpleDialog>
				)}

				{/* Confirmation checkbox */}
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem className={cn('flex flex-row items-center justify-start gap-2 p-3 py-2 pr-3 w-fit rounded-md space-y-0', field.value ? 'bg-green-100' : 'bg-orange-100')}>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isPending}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel className="text-xs">
									Confirmo que los datos enviados son correctos
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