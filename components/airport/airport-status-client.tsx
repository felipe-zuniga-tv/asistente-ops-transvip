'use client'

import { useState, useEffect } from 'react'
import { Car, Users } from 'lucide-react'
import { TransvipLogo } from '../transvip/transvip-logo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Button } from '../ui/button'
import { calculateDuration, cn } from '@/lib/utils'
import Image from 'next/image'
import { LiveClock } from '../ui/live-clock'

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
    const [selectedZone, setSelectedZone] = useState(AIRPORT_ZONES.find(zone => zone.zone_id === initialZoneId) || AIRPORT_ZONES[0])
    const [vehicleTypes, setVehicleTypes] = useState(vehicleTypesList)
    const [selectedType, setSelectedType] = useState<string | null>(null); // Update state type
    const [vehicleList, setVehicleList] = useState<AirportVehicleDetail[]>([]) // Changed initial state from null to an empty array

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
        } else {
            setSelectedType(null)
        }
    }, []) // Dependency on vehicleTypes

    useEffect(() => {
        const fetchVehicles = async () => {
            console.log(`Selected Type: ${selectedType}`)
            if (!selectedType) {
                setVehicleList([])
                return
            }
            
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
                <LiveClock />
            </header>
            {/* Vehicle Type Buttons */}
            <VehicleTypes vehicleTypes={vehicleTypes}
                selectedType={selectedType || ''} 
                handleSelectedType={(type) => setSelectedType(type)} />

            <VehicleListSummary vehicleList={vehicleList} />

            {/* Vehicle List */}
            <VehicleListDetail vehicleList={vehicleList} />
        </div>
    )
}

function VehicleTypes({ vehicleTypes, handleSelectedType, selectedType }: { 
    vehicleTypes: AirportVehicleType[]
    handleSelectedType: (arg0: string) => void
    selectedType: string
}) {
    if (!vehicleTypes || vehicleTypes.length === 0) {
        return <span className='font-semibold'>No hay vehículos en la Zona iluminada</span>
    }

    return (
        <div className="bg-white shadow-sm p-4 flex justify-center space-x-4 min-h-fit text-xl lg:text-base">
            { vehicleTypes.map((vType : AirportVehicleType) => (
                <Button key={vType.name}
                    onClick={() => handleSelectedType(vType.name)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors w-48 h-auto ${selectedType === vType.name
                        ? 'bg-transvip hover:bg-transvip-dark text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                >
                    {/* <Image src={vType.vehicle_image} height={50} width={50} className='h-12 w-auto' alt={vType.name} /> */}
                    { vType.name.toLowerCase() === 'minibus' ? <Users className="w-12 h-12 mb-2" /> : <Car className="w-12 h-12 mb-2" />}
                    <div className='flex flex-row items-center gap-2 justify-center'>
                        <span className="text-2xl font-semibold">{vType.name}</span>
                        <span className="font-semibold">·</span>
                        <span className="text-2xl font-semibold">{vType.count}</span>
                    </div>
                </Button>
            ))}
        </div>
    )
}

function VehicleListSummary({ vehicleList }: { vehicleList : AirportVehicleDetail[] }) {
    const vehicles_with_passengers = !vehicleList ? 0 : vehicleList.filter(v => v.total_passengers > 0).length
    const vehicles_without_passengers = !vehicleList ? 0 : vehicleList.filter(v => v.total_passengers === 0 || !v.total_passengers).length

    return (
        <div className='w-full p-3 bg-white flex justify-center items-center gap-3 text-xl lg:text-base'>
            <div className='flex flex-row gap-1 justify-center items-center'>
                <span className='font-semibold'>Con Pasajeros:</span>
                <span>{vehicles_with_passengers}</span>
            </div>
            <span>·</span>
            <div className='flex flex-row gap-1 justify-center items-center'>
                <span className='font-semibold'>Sin Pasajeros:</span>
                <span>{ vehicles_without_passengers }</span>
            </div>
        </div>
    )
}

function VehicleListDetail({ vehicleList } : { vehicleList: AirportVehicleDetail[] }) {
    if (!vehicleList || vehicleList.length === 0) {
        return <div className='w-full p-3 font-bold'>Sin resultados</div>
    }

    return (
        <div className="flex-grow overflow-auto p-3">
            <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-gray-700">
                    <tr className='text-xl lg:text-base'>
                        <th className="p-4 text-center">#</th>
                        <th className="p-4 text-center">Móvil</th>
                        <th className="p-4 text-center"></th>
                        <th className="p-4 text-center">Conductor</th>
                        <th className="p-4 text-center">Entrada ZI</th>
                        <th className="p-4 text-center min-w-[100px]">Con Pax</th>
                        <th className="p-4 text-center">Pax</th>
                    </tr>
                </thead>
                <tbody>
                    { vehicleList.map((vehicle, index) => (
                        <tr key={vehicle.unique_car_id} className={cn('text-xl lg:text-base', index % 2 === 0 ? 'bg-gray-50' : 'bg-white')}>
                            <td className="p-4 text-center">{index + 1}</td>
                            <td className="p-4 text-center">{vehicle.unique_car_id}{vehicle.tipo_contrato === 'Leasing' ? 'L': ''}</td>
                            <td className="p-4 text-center">{vehicle.name.includes('*') ? 'D80' : ''}</td>
                            <td className="p-4 text-center">{vehicle.fleet_name.trim()}</td>
                            <td className="p-4 text-center">{calculateDuration(vehicle.entry_time, false)}</td>
                            <td className="p-4 text-center">{vehicle.passenger_entry_time ? calculateDuration(vehicle.passenger_entry_time) : '-'}</td>
                            <td className="hidden p-4 text-center">{vehicle.passenger_entry_time ? new Date(vehicle.passenger_entry_time).toLocaleString('es-CL') : '-'}</td>
                            <td className="p-4 text-center">{vehicle.total_passengers ? vehicle.total_passengers : 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}