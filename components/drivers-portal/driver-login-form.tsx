'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createDriverSession } from "@/lib/driver/auth"
import { searchDriver } from "@/lib/services/driver"
import { IDriverVehicles } from "@/types"
import { Routes } from "@/utils/routes"
import { ALLOWED_VEHICLE_NAMES_PARKING_TICKETS, type AllowedCarName } from "@/lib/utils/constants"

export function DriverLoginForm() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string>()
	const router = useRouter()

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()

		setIsLoading(true)
		setError(undefined)

		try {
			const formData = new FormData(event.currentTarget)
			const email = formData.get('email') as string

			if (!email || !email.includes('@')) {
				throw new Error('Por favor ingrese un email válido')
			}

			// Search driver by email and validate access
			const driverData = await searchDriver(email)
			if (!driverData || !driverData.fleet_id) {
				throw new Error('Conductor no encontrado')
			}
			if (driverData.is_blocked === 1) {
				throw new Error('Este conductor no tiene acceso.')
			}

			// Get active own vehicles
			const activeOwnVehicles = driverData.car_details.filter((v: IDriverVehicles) => 
				v.working_status === 1 && ALLOWED_VEHICLE_NAMES_PARKING_TICKETS.includes(v.car_name)
			) || []

			// Get assigned vehicles that are allowed
			const allowedAssignedVehicles = driverData.assigned_cars?.filter((v: IDriverVehicles) =>
				ALLOWED_VEHICLE_NAMES_PARKING_TICKETS.includes(v.car_name)
			) || []

			// Validate if driver has any valid vehicles
			if (activeOwnVehicles.length === 0 && allowedAssignedVehicles.length === 0) {
				throw new Error('No tienes vehículos activos asignados para registrar tickets')
			}

			// Create driver session
			await createDriverSession(driverData)

			setIsLoading(false)
			router.push(Routes.DRIVERS.TICKETS_DASHBOARD)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
			setIsLoading(false)
		}
	}

	return (
		<div className="flex flex-col gap-2">
			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<form onSubmit={onSubmit} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						placeholder="conductor@email.com"
						required
						disabled={isLoading}
					/>
				</div>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Verificando..." : "Ingresar"}
				</Button>
			</form>
		</div>
	)
} 