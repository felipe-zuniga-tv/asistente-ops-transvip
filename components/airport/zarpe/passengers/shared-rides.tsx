'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { toast } from '@/hooks/use-toast'
import { ZarpePassenger } from '@/lib/airport/types'
import PassengerCard from './passenger-card'
import { Input } from '@/components/ui/input'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'

interface SharedRidesProps {
	passengerCount: {
		shared: number
		lowFrequency: number
	}
	setPassengerCount: React.Dispatch<React.SetStateAction<{
		shared: number
		lowFrequency: number
	}>>
	setShowOptimizingModal: React.Dispatch<React.SetStateAction<boolean>>
}

export function SharedRides({ passengerCount, setPassengerCount, setShowOptimizingModal }: SharedRidesProps) {
	const [nextOptimizationTime, setNextOptimizationTime] = useState(17)
	const [filter, setFilter] = useState('')

	useEffect(() => {
		const timer = setInterval(() => {
			setNextOptimizationTime((prevTime) => {
				if (prevTime <= 0) return 17
				return prevTime - 1
			})
		}, 60000) // Update every minute
		return () => clearInterval(timer)
	}, [])

	const generateRandomReservation = () => {
		return Math.floor(Math.random() * (10000000 - 9000000) + 9000000).toString()
	}

	const sharedPassengers: ZarpePassenger[] = [
		{ booking: generateRandomReservation(), nombre: "Juan Pérez", comuna: "Las Condes", minutos: 15, terminal: "T1", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "María González", comuna: "Providencia", minutos: 12, terminal: "T2", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Carlos Rodríguez", comuna: "Vitacura", minutos: 8, terminal: "T1", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Ana Martínez", comuna: "Ñuñoa", minutos: 17, terminal: "T2", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Pedro Sánchez", comuna: "La Reina", minutos: 14, terminal: "T1", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Laura Gómez", comuna: "Lo Barnechea", minutos: 16, terminal: "T2", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Diego Muñoz", comuna: "Huechuraba", minutos: 11, terminal: "T1", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Valentina Castro", comuna: "Maipú", minutos: 13, terminal: "T2", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Andrés Silva", comuna: "Peñalolén", minutos: 9, terminal: "T1", total_pax: 2 },
		{ booking: generateRandomReservation(), nombre: "Camila Vargas", comuna: "Quilicura", minutos: 10, terminal: "T2", total_pax: 2 },
	].sort((a, b) => b.minutos - a.minutos)

	return (
		<div className="flex flex-col gap-2 p-4">
			<div className="hidden p-6 bg-white rounded-xl shadow-lg">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-xl font-semibold text-gray-800 dark:text-white">Próxima optimización</h3>
					<p className="text-lg font-medium text-orange-600 dark:text-orange-400">{nextOptimizationTime} minutos</p>
				</div>
				<div className="flex items-center space-x-4 mb-4">
					<div className="flex-1">
						<p className="text-sm font-medium mb-1 dark:text-white">T1: {sharedPassengers.filter(p => p.terminal === 'T1').length} / 25</p>
						<Progress value={(sharedPassengers.filter(p => p.terminal === 'T1').length / 25) * 100} className="bg-blue-100 dark:bg-blue-900">
							<div className="h-full bg-blue-600 rounded-full"></div>
						</Progress>
					</div>
					<div className="flex-1">
						<p className="text-sm font-medium mb-1 dark:text-white">T2: {sharedPassengers.filter(p => p.terminal === 'T2').length} / 25</p>
						<Progress value={(sharedPassengers.filter(p => p.terminal === 'T2').length / 25) * 100} className="bg-red-100 dark:bg-red-900">
							<div className="h-full bg-red-600 rounded-full"></div>
						</Progress>
					</div>
				</div>
				<Button
					onClick={() => {
						setShowOptimizingModal(true)
						// Simulate optimization process
						setTimeout(() => {
							setShowOptimizingModal(false)
							// Update passenger counts
							setPassengerCount(prev => ({
								...prev,
								shared: Math.max(0, prev.shared - Math.floor(Math.random() * 10))
							}))
							// Add a new route to 'Rutas en Curso'
							toast({
								title: "Optimización completada",
								description: "Ruta añadida a menú 'Rutas en Curso'",
							})
						}, 2000)
					}}
					className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
				>
					Optimizar ahora
				</Button>
			</div>
			<div className="p-6 bg-white rounded-xl shadow-lg flex flex-col gap-4">
				<div className='passenger-list-header'>
					<div className="flex justify-between items-center">
						<span className="text-2xl font-bold text-gray-800 dark:text-white">
							Compartidos en espera · {sharedPassengers.length}
						</span>
						<div className="relative">
							<MagnifyingGlassIcon className="size-5 absolute left-3 top-2.5 text-gray-400" />
							<input
								type="text"
								placeholder="Filtra en las reservas"
								value={filter}
								onChange={(e) => setFilter(e.target.value)}
								className="pl-10 p-2 border text-gray-900 rounded-md bg-gray-50 w-full"
							/>
						</div>
					</div>
				</div>
				<div className='passenger-list-details'>
					<div className="flex flex-col gap-4 items-center">
						{(() => {
							const filteredPassengers = sharedPassengers.filter(passenger => 
								[passenger.booking, passenger.nombre, passenger.comuna, passenger.terminal]
									.some(field => field.toLowerCase().includes(filter.toLowerCase()))
							);

							return filteredPassengers.length > 0 ? (
								filteredPassengers.map((passenger) => (
									<PassengerCard key={passenger.booking} passenger={passenger} />
								))
							) : (
								<p className="text-gray-500">No hay resultados</p>
							);
						})()}
					</div>
				</div>
			</div>
		</div>
	)
}