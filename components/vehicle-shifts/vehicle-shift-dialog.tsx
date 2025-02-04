"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { createVehicleShift, updateVehicleShift } from "@/lib/shifts/actions"
import { VehicleShift } from "./vehicle-shifts"

const formSchema = z.object({
	vehicle_number: z.coerce.number().min(1, "El número debe ser mayor a 0"),
	shift_id: z.string().uuid("Seleccione un turno válido"),
	start_date: z.string(),
	end_date: z.string(),
	priority: z.coerce.number().min(1).max(100).default(1),
}).refine(
	(data) => {
		const start = new Date(data.start_date)
		const end = new Date(data.end_date)
		return end >= start
	},
	{
		message: "La fecha de fin debe ser mayor o igual a la fecha de inicio",
		path: ["end_date"],
	}
)

type FormValues = z.infer<typeof formSchema>

const defaultValues: FormValues = {
	vehicle_number: 0,
	shift_id: "",
	start_date: new Date().toISOString().split('T')[0],
	end_date: new Date().toISOString().split('T')[0],
	priority: 1,
}

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
	shifts: { id: string; name: string }[]
	assignment?: VehicleShift | null
}

export function VehicleShiftDialog({ open, onOpenChange, shifts, assignment }: Props) {
	const router = useRouter()
	const isEditMode = !!assignment

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: assignment
			? {
				vehicle_number: assignment.vehicle_number,
				shift_id: assignment.shift_id,
				start_date: assignment.start_date,
				end_date: assignment.end_date,
				priority: assignment.priority,
			}
			: defaultValues,
	})

	// Reset form when dialog opens/closes or when switching between create/edit modes
	useEffect(() => {
		if (open) {
			if (assignment) {
				form.reset({
					vehicle_number: assignment.vehicle_number,
					shift_id: assignment.shift_id,
					start_date: assignment.start_date,
					end_date: assignment.end_date,
					priority: assignment.priority,
				})
			} else {
				form.reset(defaultValues)
			}
		}
	}, [open, assignment, form])

	async function onSubmit(values: FormValues) {
		try {
			if (isEditMode && assignment) {
				await updateVehicleShift(assignment.id, {
					...values,
					start_date: new Date(values.start_date),
					end_date: new Date(values.end_date),
				})
				toast.success("Asignación actualizada exitosamente")
			} else {
				await createVehicleShift({
					...values,
					start_date: new Date(values.start_date),
					end_date: new Date(values.end_date),
				})
				toast.success("Asignación creada exitosamente")
			}
			onOpenChange(false)
			router.refresh()
		} catch (error) {
			console.error(error)
			toast.error(isEditMode
				? "Error al actualizar la asignación"
				: "Error al crear la asignación"
			)
		}
	}

	function handleOpenChange(open: boolean) {
		form.reset(defaultValues)
		onOpenChange(open)
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{isEditMode ? "Editar Asignación de Vehículo" : "Nueva Asignación de Vehículo"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="vehicle_number"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Número de Móvil</FormLabel>
									<FormControl>
										<Input type="number" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="shift_id"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Turno</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Seleccione un turno" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{shifts.map((shift) => (
												<SelectItem key={shift.id} value={shift.id}>
													{shift.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="start_date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fecha Inicio</FormLabel>
										<FormControl>
											<Input type="date" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="end_date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Fecha Fin</FormLabel>
										<FormControl>
											<Input
												type="date"
												{...field}
												min={form.getValues("start_date")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prioridad</FormLabel>
									<FormControl>
										<Input type="number" {...field} min={1} max={100} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end space-x-2 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
							>
								Cancelar
							</Button>
							<Button type="submit">
								{isEditMode ? "Guardar" : "Crear"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
} 