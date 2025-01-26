'use client'

import { useCallback, useEffect, useState } from 'react'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { branches, vehicleTypes } from '@/lib/config/transvip-general'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { IVehicleDetail } from '@/lib/types/chat'
import { getVehicleList } from '@/lib/chat/functions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TransvipLogo } from '../transvip/transvip-logo'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getVehicles } from '@/lib/general/actions'

interface VehicleListProps {
	branch: number
	initialVehicles: IVehicleDetail[]
	onSearch?: (filters: VehicleFilters, branch: number) => Promise<void>
}

export interface VehicleFilters {
	search: string
	vehicleType: string
	status: string
	color: string
}

export function VehicleList({ branch: initialBranch, initialVehicles = [], onSearch }: VehicleListProps) {
	const [vehicles, setVehicles] = useState<IVehicleDetail[]>(initialVehicles)
	const [branch, setBranch] = useState(initialBranch)
	const [isLoading, setIsLoading] = useState(false)
	const [page, setPage] = useState(1)
	const limit = 10
	const [filters, setFilters] = useState({
		search: '',
		vehicleType: 'Todos',
		status: 'Todos',
		branch: 'Todos',
	})
	const [showFilters, setShowFilters] = useState(false)

	const fetchVehicles = useCallback(async () => {
		setIsLoading(true)
		try {
			const offset = (page - 1) * limit
			const data = await getVehicles({ branch, offset, limit })
			if (data) setVehicles(data)
		} catch (error) {
			console.error('Error fetching vehicles:', error)
		} finally {
			setIsLoading(false)
		}
	}, [branch, page])

	useEffect(() => {
		setPage(1)
	}, [branch])

	const filteredVehicles = vehicles.filter((vehicle) => {
		const searchLower = filters.search.toLowerCase()

		return (
			(filters.branch === 'Todos' || vehicle.branch.name === filters.branch) &&
			(filters.vehicleType === 'Todos' || vehicle.type.name === filters.vehicleType) &&
			(filters.status === 'Todos' || vehicle.status.toString() === filters.status) &&
			(filters.search === '' ||
				vehicle.license_plate.toLowerCase().includes(searchLower) ||
				vehicle.vehicle_number.toString().includes(searchLower) ||
				`${vehicle.owner.first_name} ${vehicle.owner.last_name}`
					.toLowerCase()
					.includes(searchLower))
		)
	})

	return (
		<MaxWidthWrapper>
			<div className="space-y-6">
				<div className='flex flex-row gap-2 items-center justify-start'>
					<TransvipLogo size={20} />
					<h1 className="text-2xl font-semibold tracking-tight">Vehículos</h1>
				</div>

				<div className="flex items-center gap-2">
					<Switch
						checked={showFilters}
						onCheckedChange={setShowFilters}
					/>
					<Label>Mostrar filtros</Label>
				</div>

				{showFilters && (
					<div className="rounded-lg border p-4 space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div className="space-y-2">
								<Label>Sucursal</Label>
								<Select value={branch.toString()}
									onValueChange={(value) => setBranch(Number(value))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Todos">Todos</SelectItem>
										{branches.map((b) => (
											<SelectItem key={b.branch_id} value={b.branch_id.toString()}>
												{b.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Tipo de Vehículo</Label>
								<Select
									value={filters.vehicleType}
									onValueChange={(value) => setFilters(f => ({ ...f, vehicleType: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Todos">Todos</SelectItem>
										{vehicleTypes.map((type) => (
											<SelectItem key={type.id} value={type.name}>
												{type.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Status</Label>
								<Select
									value={filters.status}
									onValueChange={(value) => setFilters(f => ({ ...f, status: value }))}
								>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Todos">Todos</SelectItem>
										<SelectItem value="true">Activo</SelectItem>
										<SelectItem value="false">Inactivo</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label>Busca</Label>
								<Input
									placeholder="Buscar..."
									value={filters.search}
									onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
								/>
							</div>
						</div>

						{/* 
						<div className="flex justify-end">
							<Button 
								onClick={() => onSearch(filters, branch)}
								disabled={isLoading}
							>
								Buscar
							</Button>
						</div>
						*/}
					</div>
				)}

				<div className="flex items-center justify-end space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1 || isLoading}
					>
						<ArrowLeft /> Anterior
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => p + 1)}
						disabled={vehicles.length < limit || isLoading}
					>
						Siguiente <ArrowRight />
					</Button>
				</div>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='text-center'>Sucursal</TableHead>
							<TableHead className='text-center'># Móvil</TableHead>
							<TableHead className='text-center'>Patente</TableHead>
							<TableHead className='text-center'>Estado</TableHead>
							<TableHead className='text-center'>Titular</TableHead>
							<TableHead className='text-center'>Tipo Vehículo</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredVehicles.map((vehicle) => (
							<TableRow key={vehicle.vehicle_number}>
								<TableCell className='text-center'>{vehicle.branch.name}</TableCell>
								<TableCell className='text-center'>{vehicle.vehicle_number}</TableCell>
								<TableCell className='text-center'>{vehicle.license_plate}</TableCell>
								<TableCell className='text-center'>{vehicle.status ? 'Activo' : 'Inactivo'}</TableCell>
								<TableCell className='text-center'>{`${vehicle.owner.first_name} ${vehicle.owner.last_name}`}</TableCell>
								<TableCell className='text-center'>{vehicle.type.name}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</MaxWidthWrapper>
	)
}
