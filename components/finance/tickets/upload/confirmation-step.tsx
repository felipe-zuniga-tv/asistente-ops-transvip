import { UseFormReturn } from "react-hook-form"
import { Loader2, Check } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TicketImagePreview } from "./ticket-image-preview"
import { TicketDataCard } from "./ticket-data-card"
import { ConfirmationValues } from "./schemas"

interface ConfirmationStepProps {
	form: UseFormReturn<ConfirmationValues>
	imagePreview?: string
	onSubmit: (values: ConfirmationValues) => Promise<void>
	onBack: () => void
	isPending: boolean
	showImage: boolean
	setShowImage: (show: boolean) => void
	parsedData: any | null
	debugBookingId?: string
}

export function ConfirmationStep({
	form,
	imagePreview,
	onSubmit,
	onBack,
	isPending,
	showImage,
	setShowImage,
	parsedData,
	debugBookingId
}: ConfirmationStepProps) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
				{/* Booking ID input */}
				<FormField
					control={form.control}
					name="booking_id"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Número de Reserva</FormLabel>
							<FormControl>
								<Input
									placeholder="Ingresa tu # de Reserva"
									disabled={isPending}
									value={field.value}
									onChange={(e) => {
										console.log("Input value type:", typeof e.target.value);
										console.log("Raw input value:", e.target.value);
										field.onChange(e.target.value);
									}}
									onBlur={field.onBlur}
									name={field.name}
									ref={field.ref}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Image preview if no parsed data */}
				{imagePreview && !parsedData && (
					<TicketImagePreview
						imageUrl={imagePreview}
						height="200px"
						showRemoveButton={false}
					/>
				)}

				{/* Display parsed data */}
				{parsedData && (
					<TicketDataCard
						form={form}
						imagePreview={imagePreview}
						isPending={isPending}
						showImage={showImage}
						setShowImage={setShowImage}
						debugBookingId={debugBookingId}
					/>
				)}

				{/* Confirmation checkbox */}
				<FormField
					control={form.control}
					name="confirm"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									disabled={isPending}
								/>
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel>
									Confirmo que los datos extraídos son correctos
								</FormLabel>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-4 my-4 justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isPending}
					>
						Volver
					</Button>
					<Button type="submit" disabled={isPending || !form.formState.isValid}>
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Enviando...
							</>
						) : (
							<>
								<Check className="h-4 w-4" />
								Enviar Ticket
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
} 