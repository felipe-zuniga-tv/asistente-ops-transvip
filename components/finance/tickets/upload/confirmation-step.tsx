import { UseFormReturn } from "react-hook-form"
import { Loader2, Check, ArrowLeft } from "lucide-react"
import { Form, Button } from "@/components/ui"
import { TicketDataCard } from "./ticket-data-card"
import { ConfirmationValues } from "./schemas"

interface ConfirmationStepProps {
	form: UseFormReturn<ConfirmationValues>
	imagePreview?: string
	onSubmit: (values: ConfirmationValues) => Promise<void>
	onBack: () => void
	isPending: boolean
	parsedData: any | null
	debugBookingId?: string
}

export function ConfirmationStep({
	form,
	imagePreview,
	onSubmit,
	onBack,
	isPending,
	parsedData,
	debugBookingId
}: ConfirmationStepProps) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
				{/* Display parsed data */}
				{parsedData && (
					<TicketDataCard
						form={form}
						imagePreview={imagePreview}
						isPending={isPending}
						debugBookingId={debugBookingId}
					/>
				)}

				<div className="flex gap-4 mt-4 justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isPending}
					>
						<ArrowLeft className="h-4 w-4" />
						Volver
					</Button>
					<Button type="submit" className="bg-transvip hover:bg-transvip/90 text-white" disabled={isPending || !form.formState.isValid}>
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