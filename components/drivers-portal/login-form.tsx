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

const envToken = process.env.NEXT_PUBLIC_TOKEN_FINANCE_PARKING_TICKETS

export function LoginForm() {
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
			const vehicleNumber = formData.get('vehicle_number') as string

			if (!email || !email.includes('@')) {
				throw new Error('Por favor ingrese un email válido')
			}

			if (!vehicleNumber) {
				throw new Error('Por favor ingrese el número de vehículo')
			}

			// Search driver by email and validate vehicle
			const driverData = await searchDriver(email, envToken)
			if (!driverData || !driverData.fleet_id) {
				throw new Error('Conductor no encontrado')
			}
			if (driverData.is_blocked || driverData.is_blocked) {
				throw new Error('Este conductor no tiene acceso.')
			}

			// Validate vehicle belongs or is associated with the driver
			const hasVehicleInCarDetails = driverData.car_details.some((v: IDriverVehicles) => 
				v.working_status === 1 && v.unique_car_id.toString() === vehicleNumber.toString()
			)

			const hasVehicleInAssignedCars = driverData.assigned_cars?.some((v: IDriverVehicles) =>
				v.unique_car_id.toString() === vehicleNumber.toString()
			) || false

			if (!hasVehicleInCarDetails && !hasVehicleInAssignedCars) {
				throw new Error('El vehículo ingresado no está asignado a este conductor o no está activo')
			}

			// Create driver session
			await createDriverSession({
				id: driverData.fleet_id.toString(),
				email: email,
				full_name: `${driverData.first_name} ${driverData.last_name}`,
				active: true,
				vehicle_number: vehicleNumber,
				created_at: new Date().toISOString()
			})

			setIsLoading(false)
			router.push('/conductores/tickets/parking/dashboard')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Ha ocurrido un error')
			setIsLoading(false)
		}
	}

	return (
		<div className="space-y-3">
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

				<div className="space-y-2">
					<Label htmlFor="vehicle_number">Número de Vehículo</Label>
					<Input
						id="vehicle_number"
						name="vehicle_number"
						type="text"
						placeholder="Ej: 4212"
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