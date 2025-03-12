import { UseFormReturn } from "react-hook-form"
import { Loader2, Check } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
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

				<div className="flex gap-4 my-4 justify-between">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						disabled={isPending}
					>
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