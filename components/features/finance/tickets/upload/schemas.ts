import * as z from "zod"

// Helper function to ensure values are strings
export function ensureString(value: string | null | undefined): string {
	return value || '';
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Schema for the initial image upload step
export const imageUploadSchema = z.object({
	image: z.any().optional().refine((value) => {
		if (!value) return true;
		return value instanceof File;
	}, "Must be a valid file")
})

// Schema for the confirmation step
export const confirmationSchema = z.object({
	booking_id: z.string().min(1, 'El número de reserva es requerido'),
	vehicle_number: z.string().min(1, 'El número de vehículo es requerido'),
	nro_boleta: z.string().min(1, 'El número de boleta es requerido'),
	entry_date: z.string().min(1, 'La fecha de entrada es requerida'),
	entry_time: z.string().min(1, 'La hora de entrada es requerida'),
	exit_date: z.string().min(1, 'La fecha de salida es requerida'),
	exit_time: z.string().min(1, 'La hora de salida es requerida'),
	amount: z.string().min(1, 'El monto es requerido'),
	location: z.string().min(1, 'La ubicación es requerida'),
	confirm: z.boolean().refine((val) => val === true, {
		message: 'Debes confirmar que los datos son correctos'
	})
})

export type ImageUploadValues = z.infer<typeof imageUploadSchema>
export type ConfirmationValues = z.infer<typeof confirmationSchema>

export interface ParsedTicketData {
	nro_boleta: string
	entry_date: string
	entry_time: string
	exit_date: string
	exit_time: string
	amount: number
	location: string
} 