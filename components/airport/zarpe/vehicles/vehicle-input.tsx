'use client'

import React, { useState } from 'react'
import { Trash2, Lock, Unlock, PlusCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { VehicleDialog } from "@/components/airport/zarpe/vehicles/vehicle-dialog"
import { Vehicle } from '@/lib/airport/types'

interface VehicleInputProps {
	vehicles: { [key: string]: (Vehicle | null)[] }
	setVehicles: React.Dispatch<React.SetStateAction<{ [key: string]: (Vehicle | null)[] }>>
	currentTerminal: string
	setCurrentTerminal: React.Dispatch<React.SetStateAction<string>>
	setShowAddVehicleModal: React.Dispatch<React.SetStateAction<boolean>>
	setVehicleToDelete: React.Dispatch<React.SetStateAction<Vehicle | null>>
	setShowDeleteConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
}

export function VehicleInput({
	vehicles,
	setVehicles,
	currentTerminal,
	setCurrentTerminal,
	setShowAddVehicleModal,
	setVehicleToDelete,
	setShowDeleteConfirmModal
}: VehicleInputProps) {
	const currentVehicles = vehicles[currentTerminal]
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleBlockPosition = (index: number) => {
		const newVehicles = [...currentVehicles]
		if (newVehicles[index]?.blocked) {
			newVehicles[index] = null
		} else {
			newVehicles[index] = { blocked: true } as Vehicle
		}
		setVehicles({
			...vehicles,
			[currentTerminal]: newVehicles
		})
	}

	

	const handleAddVehicle = () => {
		setIsDialogOpen(true)
	}

	return (
		<div className="p-6 bg-white rounded-xl m-4 shadow-lg">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-800 dark:text-white">Andén de móviles</h2>
				<div className="flex items-center space-x-2">
					<span className="text-sm font-medium dark:text-white">T1</span>
					<Switch
						checked={currentTerminal === 'T2'}
						onCheckedChange={() => setCurrentTerminal(currentTerminal === 'T1' ? 'T2' : 'T1')}
					/>
					<span className="text-sm font-medium dark:text-white">T2</span>
				</div>
			</div>
			<div className='flex flex-col gap-2 w-full'>
				{ currentVehicles.map((vehicle, index) => (
					<div key={index} className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-2xl transition-all duration-300 hover:shadow-md hover:from-orange-100 hover:to-orange-200 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm">
						{ vehicle && !vehicle.blocked ? (
							<div className="flex items-center">
								<div className="w-20 h-20 bg-gradient-to-b from-orange-400 to-orange-600 dark:from-gray-500 dark:to-gray-400 rounded-2xl flex items-center justify-center relative overflow-hidden">
									{vehicle.driver && vehicle.driver.photo ? (
										<img src={vehicle.driver.photo} alt={`${vehicle.driver.name}`} className="w-full h-full object-cover" />
									) : (
										<span className="text-white text-2xl">No Photo</span>
									)}
								</div>
								<div className="ml-6 flex-grow">
									<p className="text-xl font-bold text-gray-800 dark:text-white">ID Móvil: {vehicle.vehicle_number} - Patente: {vehicle.license_plate}</p>
									<p className="text-lg text-gray-700 dark:text-gray-300">{vehicle.brand} {vehicle.model} - {vehicle.contract}</p>
									<p className="text-lg text-gray-600 dark:text-gray-400">
										{vehicle.driver ? vehicle.driver.name : 'No Driver'} -
										{vehicle.driver ? ` ${vehicle.driver.hoursConnected} horas conectado` : ''}
									</p>
								</div>
								<div className="flex flex-col items-center gap-4">
									<button
										className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
										onClick={() => {
											setVehicleToDelete(vehicle)
											setShowDeleteConfirmModal(true)
										}}
									>
										<Trash2 className="w-6 h-6" />
									</button>
									<button
										className="text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-300"
										onClick={() => handleBlockPosition(index)}
									>
										<Lock className="w-6 h-6" />
									</button>
								</div>
							</div>
						) : vehicle?.blocked ? (
							<div className="flex items-center justify-between h-32 bg-gray-200 dark:bg-gray-600 rounded-xl p-6">
								<p className="text-xl font-bold text-gray-500 dark:text-gray-300">Posición Bloqueada</p>
								<Button
									onClick={() => handleBlockPosition(index)}
									className="ml-4 bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
								>
									<Unlock className="w-5 h-5 mr-2" />
									Desbloquear
								</Button>
							</div>
						) : (
							<div className="flex justify-center space-x-4">
								<button
									onClick={handleAddVehicle}
									className="w-1/2 h-32 flex items-center justify-center text-gray-400 hover:text-orange-500 dark:text-gray-500 dark:hover:text-orange-400 transition-colors duration-300 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl hover:border-orange-500 dark:hover:border-orange-400"
								>
									<PlusCircle className="w-12 h-12" />
								</button>
								<button
									onClick={() => handleBlockPosition(index)}
									className="w-1/2 h-32 flex items-center justify-center text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-300 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl hover:border-red-500 dark:hover:border-red-400"
								>
									<Lock className="w-12 h-12" />
								</button>
							</div>
						)}
					</div>
				))}
			</div>
			<VehicleDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
		</div>
	)
}