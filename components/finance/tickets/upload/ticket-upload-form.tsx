'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateBookingForDriver, validateTicketTiming } from "@/lib/booking"
import { parseTicketImage } from "@/lib/ai"
import { createTicket } from "@/lib/tickets"
import { ImageIcon, Loader2, X } from "lucide-react"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const formSchema = z.object({
	booking_id: z.string().min(1, "El ID de reserva es requerido"),
	image: z.custom<File>()
		.refine((file): file is File => file instanceof File, "Se requiere un archivo")
		.refine((file) => file.size <= MAX_FILE_SIZE, "La imagen debe ser menor a 10MB")
		.refine(
			(file) => ['image/jpeg', 'image/png'].includes(file.type),
			"Solo se permiten archivos PNG o JPEG"
		)
		.optional()
})

type FormValues = z.infer<typeof formSchema>

interface TicketUploadFormProps {
	driverId: string
}

export function TicketUploadForm({ driverId }: TicketUploadFormProps) {
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			booking_id: "",
		}
	})

	const [error, setError] = useState<string>()
	const [imagePreview, setImagePreview] = useState<string>()

	async function onSubmit(values: FormValues) {
		setError(undefined)
		
		if (!values.image) {
			setError('Por favor, selecciona una imagen')
			return
		}
		
		startTransition(async () => {
			try {
				const { booking_id, image } = values

				// Validate booking belongs to driver
				const bookingValidation = await validateBookingForDriver(booking_id, driverId)
				if (!bookingValidation.isValid) {
					throw new Error(bookingValidation.error || 'ID de reserva inválido')
				}

				// Convert image to base64
				const imageBase64 = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader()
					reader.onload = () => resolve(reader.result as string)
					reader.onerror = reject
					reader.readAsDataURL(image as Blob)
				})

				// Parse ticket with AI
				const parsedData = await parseTicketImage(imageBase64)

				// Validate ticket timing
				const timingValidation = await validateTicketTiming(parsedData.exit_timestamp, booking_id)
				if (!timingValidation.isValid) {
					throw new Error(timingValidation.error || 'Tiempo de ticket inválido')
				}

				// Create ticket
				await createTicket(driverId, booking_id, imageBase64, {
					...parsedData,
					image_url: imageBase64
				})

				// Reset form
				form.reset()
				setImagePreview(undefined)

				// Redirect to history page
				router.push('/drivers/tickets/parking/history')
			} catch (err) {
				console.error(err)
				setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
			}
		})
	}

	function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (file) {
			form.setValue('image', file, { shouldValidate: true })
			setImagePreview(URL.createObjectURL(file))
			setError(undefined)
		}
	}

	function handleRemoveImage() {
		form.setValue('image', undefined, { shouldValidate: true })
		setImagePreview(undefined)
		setError(undefined)
	}

	return (
		<div className="space-y-6">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="booking_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>ID Reserva</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingresa tu ID Reserva"
										disabled={isPending}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="image"
						render={({ field: { onChange, value, ...field } }) => (
							<FormItem>
								<FormLabel>Imagen del Ticket</FormLabel>
								<FormControl>
									<div className="space-y-2">
										{imagePreview ? (
											<div className="relative aspect-[4/3] w-full h-[300px]">
												<Image
													src={imagePreview}
													alt="Ticket preview"
													fill
													className="rounded-lg object-contain w-auto"
												/>
												<Button
													type="button"
													variant="secondary"
													size="icon"
													className="absolute right-2 top-2"
													onClick={handleRemoveImage}
												>
													<X className="h-4 w-4" />
												</Button>
											</div>
										) : (
											<div className="flex flex-col items-center gap-4 rounded-lg border border-dashed p-8">
												<div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
													<ImageIcon className="h-6 w-6" />
												</div>
												<div className="space-y-1 text-center">
													<p className="text-sm text-muted-foreground">
														Sube tu imagen del ticket de estacionamiento
													</p>
													<p className="text-xs text-muted-foreground">
														PNG, JPG o JPEG (máx. 10MB)
													</p>
												</div>
												<Input
													id="image"
													type="file"
													accept="image/png,image/jpeg"
													className="hidden"
													onChange={handleImageChange}
													disabled={isPending}
													{...field}
												/>
												<Button
													type="button"
													variant="secondary"
													onClick={() => document.getElementById('image')?.click()}
													disabled={isPending}
												>
													Seleccionar Imagen
												</Button>
											</div>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Procesando...
							</>
						) : (
							"Enviar Ticket"
						)}
					</Button>
				</form>
			</Form>
		</div>
	)
}