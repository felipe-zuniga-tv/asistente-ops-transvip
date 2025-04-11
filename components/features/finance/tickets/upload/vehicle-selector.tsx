'use client'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui"
import { Loader2 } from "lucide-react"
import { Vehicle } from "@/components/finance/tickets/upload/ticket-upload-form"

interface VehicleSelectorProps {
	vehicles: Vehicle[]
	value?: string
	onValueChange: (value: string) => void
	disabled?: boolean
	isLoading?: boolean
	error?: string
}

export function VehicleSelector({ 
	vehicles, 
	value, 
	onValueChange, 
	disabled,
	isLoading,
	error 
}: VehicleSelectorProps) {
	if (error) {
		return <div className="text-sm text-destructive">{error}</div>
	}
	return (
		<Select
			value={value}
			onValueChange={onValueChange}
			disabled={disabled || isLoading}
		>
			<SelectTrigger>
				<SelectValue placeholder={
					isLoading ? (
						<span className="flex items-center gap-2">
							<Loader2 className="h-4 w-4 animate-spin" />
							Cargando vehículos...
						</span>
					) : "Selecciona un vehículo"
				} />
			</SelectTrigger>
			<SelectContent>
				{!isLoading && vehicles.length === 0 && (
					<div className="px-2 py-4 text-sm text-muted-foreground text-center">
						No se encontraron vehículos disponibles
					</div>
				)}
				{vehicles.length > 0 && (
					<SelectGroup>
						{vehicles.map((vehicle) => (
							<SelectItem
								key={vehicle.vehicle_number}
								value={vehicle.vehicle_number}
							>
								{vehicle.vehicle_number} - {vehicle.license_plate}
							</SelectItem>
						))}
					</SelectGroup>
				)}
			</SelectContent>
		</Select>
	)
} 