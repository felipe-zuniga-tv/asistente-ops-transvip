'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { parseTicketImage } from "@/lib/services/ai"
import { createTicket } from "@/lib/features/tickets"
import { uploadTicketImageServer } from "@/lib/storage"
import { ImageUploadStep } from "./image-upload-step"
import { ConfirmationStep } from "./confirmation-step"
import { type DriverSession } from "@/types/domain/driver/models"
import { 
	imageUploadSchema, 
	confirmationSchema, 
	ImageUploadValues, 
	ConfirmationValues,
	ParsedTicketData,
	ensureString
} from "./schemas"

export interface Vehicle {
	vehicle_number: string
	license_plate: string
	type: string
}

interface TicketUploadFormProps {
	session: DriverSession
	// vehicles: Vehicle[]
}

const defaultConfirmFormValues: ConfirmationValues = {
	booking_id: "",
	vehicle_number: "",
	nro_boleta: "",
	entry_date: "",
	entry_time: "",
	exit_date: "",
	exit_time: "",
	amount: "",
	location: "",
	confirm: false
}

export function TicketUploadForm({ session }: TicketUploadFormProps) {
	const [isPending, startTransition] = useTransition()
	const [isProcessing, setIsProcessing] = useState(false)
	const router = useRouter()

	// Track the current step in the flow
	const [currentStep, setCurrentStep] = useState<'upload' | 'confirm'>('upload')
	
	// Store parsed data from the image
	const [parsedData, setParsedData] = useState<ParsedTicketData | null>(null)

	// Image upload form
	const imageForm = useForm<ImageUploadValues>({
		resolver: zodResolver(imageUploadSchema),
		defaultValues: {}
	})

	// Confirmation form
	const confirmForm = useForm<ConfirmationValues>({
		resolver: zodResolver(confirmationSchema),
		defaultValues: defaultConfirmFormValues
	})

	// Debug state to track booking_id value
	const [debugBookingId, setDebugBookingId] = useState<string>("")

	const [error, setError] = useState<string>()
	const [imagePreview, setImagePreview] = useState<string>()
	const [uploadedImageUrl, setUploadedImageUrl] = useState<string>()

	// When transitioning to confirmation step
	const moveToConfirmationStep = () => {
		// Ensure form values are reset when moving to confirmation
		if (parsedData) {
			confirmForm.reset({
				booking_id: "",
				vehicle_number: "",
				nro_boleta: parsedData.nro_boleta,
				entry_date: parsedData.entry_date,
				entry_time: parsedData.entry_time,
				exit_date: parsedData.exit_date,
				exit_time: parsedData.exit_time,
				amount: parsedData.amount.toString(),
				location: parsedData.location,
				confirm: false
			});
		} else {
			resetConfirmationForm();
		}
		setCurrentStep('confirm');
	};

	// Process the image after upload
	async function processImage(values: ImageUploadValues) {
		if (!values.image || !session) {
			setError('Por favor, selecciona una imagen')
			return
		}

		setIsProcessing(true)
		setError(undefined)

		try {
			// Convert image to base64
			const imageBase64 = await new Promise<string>((resolve, reject) => {
				const reader = new FileReader()
				reader.onload = () => resolve(reader.result as string)
				reader.onerror = reject
				reader.readAsDataURL(values.image as Blob)
			})

			// Parse ticket with AI
			const extractedData = await parseTicketImage(imageBase64)
			setParsedData(extractedData)

			// Upload image to storage to get URL using server function
			const imageUrl = await uploadTicketImageServer(session.driver_id, "temp", imageBase64)
			setUploadedImageUrl(imageUrl)

			// Reset the form with all extracted data at once
			confirmForm.reset({
				booking_id: '',  // Left empty for user input
				vehicle_number: '',  // Left empty for user input
				nro_boleta: extractedData.nro_boleta,
				entry_date: extractedData.entry_date,
				entry_time: extractedData.entry_time,
				exit_date: extractedData.exit_date,
				exit_time: extractedData.exit_time,
				amount: extractedData.amount.toString(),
				location: extractedData.location,
				confirm: false
			})

			// Move to the confirmation step
			setCurrentStep('confirm')
		} catch (err) {
			console.error(err)
			setError(err instanceof Error ? err.message : 'Error al procesar la imagen')
		} finally {
			setIsProcessing(false)
		}
	}

	// Final submission after confirmation
	async function submitTicket(values: ConfirmationValues) {
		if (!uploadedImageUrl || !session) {
			setError('Información del ticket incompleta. Por favor, intenta de nuevo.')
			return
		}

		if (!values.vehicle_number) {
			setError('Por favor selecciona un vehículo')
			return
		}

		// Store for display
		setDebugBookingId(ensureString(values.booking_id))

		setError(undefined)
		startTransition(async () => {
			try {
				// Ensure booking_id is a string
				const booking_id = ensureString(values.booking_id)

				console.log('session', session)

				// Create ticket with form data and image URL
				await createTicket(session.driver_id, values.vehicle_number, booking_id, uploadedImageUrl, {
					nro_boleta: values.nro_boleta,
					entry_date: values.entry_date,
					entry_time: values.entry_time,
					exit_date: values.exit_date,
					exit_time: values.exit_time,
					amount: parseFloat(values.amount),
					location: values.location,
					image_url: uploadedImageUrl
				})

				// Reset forms and state
				imageForm.reset()
				confirmForm.reset()
				setImagePreview(undefined)
				setParsedData(null)
				setUploadedImageUrl(undefined)
				setCurrentStep('upload')

				// Redirect to history page
				router.push('/conductores/tickets/parking/dashboard')
			} catch (err) {
				console.error(err)
				setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
			}
		})
	}

	// Reset confirmation form and initialize with empty values
	const resetConfirmationForm = () => {
		confirmForm.reset(defaultConfirmFormValues)
	};

	// Use this function when moving between steps
	const moveToUploadStep = () => {
		setCurrentStep('upload');
		resetConfirmationForm();
	};

	function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (file) {
			imageForm.setValue('image', file, { shouldValidate: true })
			setImagePreview(URL.createObjectURL(file))
			setError(undefined)
		}
	}

	function handleRemoveImage() {
		imageForm.reset()
		setImagePreview(undefined)
		setError(undefined)
	}

	return (
		<div className="space-y-3">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{currentStep === 'upload' ? (
				<ImageUploadStep
					form={imageForm}
					imagePreview={imagePreview}
					onSubmit={processImage}
					onImageChange={handleImageChange}
					onRemoveImage={handleRemoveImage}
					isProcessing={isProcessing}
				/>
			) : (
				<ConfirmationStep
					form={confirmForm}
					imagePreview={imagePreview}
					onSubmit={submitTicket}
					onBack={moveToUploadStep}
					isPending={isPending}
					parsedData={parsedData}
					debugBookingId={debugBookingId}
					// vehicles={vehicles}
				/>
			)}
		</div>
	)
}