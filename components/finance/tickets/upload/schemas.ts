import * as z from "zod"

// Helper function to ensure values are strings
export function ensureString(value: unknown): string {
	if (value === null || value === undefined) return '';
	if (typeof value === 'string') return value;
	if (value instanceof File) return `[File: ${value.name}]`;
	return String(value);
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Schema for the initial image upload step
export const imageUploadSchema = z.object({
	image: z.any()
		.refine((file): file is File => file instanceof File, "Se requiere un archivo")
		.refine((file) => file.size <= MAX_FILE_SIZE, "La imagen debe ser menor a 10MB")
		.refine(
			(file) => ['image/jpeg', 'image/png'].includes(file.type),
			"Solo se permiten archivos PNG o JPEG"
		)
})

// Schema for the confirmation step
export const confirmationSchema = z.object({
	booking_id: z.union([
		z.string().min(1, "El # de reserva es requerido"),
		z.instanceof(File).transform(file => `[File: ${file.name}]`)
	]).transform(val => ensureString(val)),
	vehicle_number: z.string().optional(),
	nro_boleta: z.string().min(1, "El número de boleta es requerido"),
	entry_date: z.string().min(1, "La fecha de entrada es requerida"),
	entry_time: z.string().min(1, "La hora de entrada es requerida"),
	exit_date: z.string().min(1, "La fecha de salida es requerida"),
	exit_time: z.string().min(1, "La hora de salida es requerida"),
	amount: z.string().min(1, "El monto es requerido"),
	location: z.string().min(1, "La ubicación es requerida"),
	confirm: z.boolean().refine(val => val === true, "Debes confirmar para continuar")
})

export type ImageUploadValues = z.infer<typeof imageUploadSchema>
export type ConfirmationValues = z.infer<typeof confirmationSchema>

export type ParsedTicketData = {
	nro_boleta: string
	entry_date: string
	entry_time: string
	exit_date: string
	exit_time: string
	amount: number
	location: string
	vehicle_number?: string
} 