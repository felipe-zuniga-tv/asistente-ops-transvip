'use client'

import { useState, useEffect } from 'react'
import { Car, Users } from 'lucide-react'
import { TransvipLogo } from '../transvip/transvip-logo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'

const AIRPORT_ZONES = [
    { city_name: 'Santiago', airport_code: 'SCL', branch_id: 1, zone_id: 2 },
    { city_name: 'Antofagasta', airport_code: 'ANF', branch_id: 34, zone_id: 3 }
]

interface AirportVehicleType {
    id: number[]
    count: number
    vehicle_image: string
    name: string
}

interface AirportVehicleDetail {
    unique_car_id: string
    tipo_contrato: string
    name: string
    action: number
    fleet_id: number
    fleet_name: string
    entry_time: string
    total_passengers: number
    passenger_entry_time: string
}

export default function AirportStatusClient({ vehicleTypesList, zoneId: initialZoneId }: {
    vehicleTypesList: AirportVehicleType[]
    zoneId: number
}) {
    const [vehicleTypes, setVehicleTypes] = useState(vehicleTypesList)
    const [vehicleList, setVehicleList] = useState<AirportVehicleDetail[]>([]) // Changed initial state from null to an empty array
    const [selectedZone, setSelectedZone] = useState(AIRPORT_ZONES.find(zone => zone.zone_id === initialZoneId) || AIRPORT_ZONES[0])
    const [selectedType, setSelectedType] = useState<string | null>(null); // Update state type

    const fetchVehicles = async (vehicleId : string) => {
        const response = await fetch(`/api/airport/get-vehicles-dashboard?branchId=${selectedZone.branch_id}&zoneId=${selectedZone.zone_id}&vehicleId=${vehicleId}`)
        if (response.ok) {
            const data = await response.json()
            setVehicleList(data)
        }
    }

    useEffect(() => {
        const fetchUpdates = async () => {
            const response = await fetch(`/api/airport/refresh-dashboard?zoneId=${selectedZone.zone_id}`)
            if (response.ok) {
                const data = await response.json()
                setVehicleTypes(data)
            }
        }

        fetchUpdates() // Fetch immediately when component mounts or zone changes
        const interval = setInterval(fetchUpdates, 10000) // Then every 10 seconds

        return () => clearInterval(interval)
    }, [selectedZone])

    // First Render
    useEffect(() => {
        const fetchVehicles = async () => {
            console.log(`Selected Type: ${selectedType}`)
            const response = await fetch(`/api/airport/get-vehicles-dashboard?branchId=${selectedZone.branch_id}&zoneId=${selectedZone.zone_id}&vehicleId=${vehicleTypes[0].id}`)
            if (response.ok) {
                const data = await response.json()
                setVehicleList(data)
            }
        }

        // New effect to select the first vehicle type on render
        if (vehicleTypes.length > 0 && !selectedType) {
            setSelectedType(vehicleTypes[0].name); // Select the first vehicle type on initial render
            fetchVehicles()
        }
    }, []) // Dependency on vehicleTypes

    useEffect(() => {
        const fetchVehicles = async () => {
            console.log(`Selected Type: ${selectedType}`)
            const response = await fetch(`/api/airport/get-vehicles-dashboard?branchId=${selectedZone.branch_id}&zoneId=${selectedZone.zone_id}&vehicleId=${vehicleTypes.find(v => v.name === selectedType)?.id}`)
            if (response.ok) {
                const data = await response.json()
                setVehicleList(data)
            }
        }
        // Fetch vehicles whenever selectedType changes
        if (selectedType) {
            fetchVehicles()
        }
    }, [selectedType, vehicleTypes]) // Dependency on selectedType and vehicleTypes

    const calculateDuration = (entryTime: String) => {
        const entry = new Date(entryTime as string)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / 60000)
        return `${entry.toLocaleString('es-CL')} (${diffInMinutes} min)`
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-transvip/90 shadow-md p-4 flex flex-col-reverse md:flex-row justify-start items-center gap-2 md:gap-8">
                <div className='flex flex-row items-center justify-start gap-4'>
                    <TransvipLogo size={30} colored={false} logoOnly={true} />
                    <div className="flex items-center space-x-4">
                        <Select onValueChange={(value) => setSelectedZone(AIRPORT_ZONES.find(zone => zone.zone_id.toString() === value) || AIRPORT_ZONES[0])}>
                            <SelectTrigger className="w-[230px] bg-white">
                                <SelectValue placeholder={`${AIRPORT_ZONES[0].city_name} (${AIRPORT_ZONES[0].airport_code})`} />
                            </SelectTrigger>
                            <SelectContent>
                                { AIRPORT_ZONES.map((zone) => (
                                    <SelectItem value={zone.zone_id.toString()} key={zone.zone_id}>
                                        {zone.city_name} ({zone.airport_code})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-white">Zona Iluminada</h1>
            </header>

            {/* Vehicle Type Buttons */}
            <div className="bg-white shadow-sm p-4 flex justify-center space-x-4 h-1/5 min-h-fit">
                { vehicleTypes.length === 0 && (<span className=''>No hay vehículos en la Zona iluminada</span>)}
                { vehicleTypes.map((vType : AirportVehicleType) => (
                    <Button
                        key={vType.name}
                        onClick={() => setSelectedType(vType.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors w-48 h-32 ${selectedType === vType.name
                            ? 'bg-transvip hover:bg-transvip-dark text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                    >
                        {vType.name.toLowerCase() === 'minibus' ? <Users className="w-12 h-12 mb-2" /> : <Car className="w-12 h-12 mb-2" />}
                        <span className="text-xl font-semibold">{vType.name}</span>
                        <span className="text-2xl font-bold">{vType.count}</span>
                    </Button>
                ))}
            </div>

            {/* Vehicle List */}
            <div className="flex-grow overflow-auto p-4">
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="p-4 text-center">#</th>
                            <th className="p-4 text-center">MÓVIL</th>
                            <th className="hidden p-4 text-center">CONTRATO</th>
                            <th className="p-4 text-center">CONDUCTOR</th>
                            <th className="p-4 text-center">ENTRADA</th>
                            <th className="p-4 text-center">CON PAX</th>
                            <th className="p-4 text-center">PAX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicleList.length === 0 && <tr className='p-4'>Sin resultados</tr>}
                        {vehicleList.map((vehicle, index) => (
                            <tr key={vehicle.unique_car_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="p-4 text-center">{index + 1}</td>
                                <td className="p-4 text-center">{vehicle.unique_car_id}{vehicle.tipo_contrato === 'Leasing' ? 'L': ''}</td>
                                <td className="hidden p-4 text-center">{vehicle.tipo_contrato}</td>
                                <td className="p-4 text-center">{vehicle.fleet_name}</td>
                                <td className="p-4 text-center">{calculateDuration(vehicle.entry_time)}</td>
                                <td className="p-4 text-center">{vehicle.passenger_entry_time ? new Date(vehicle.passenger_entry_time).toLocaleString('es-CL') : '-'}</td>
                                <td className="p-4 text-center">{vehicle.total_passengers ? vehicle.total_passengers : 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
