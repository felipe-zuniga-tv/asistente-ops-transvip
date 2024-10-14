'use client'

import { useState, useEffect, Suspense } from 'react'
import { TransvipLogo } from '../transvip/transvip-logo'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { calculateDuration, cn } from '@/lib/utils'
import { LiveClock } from '../ui/live-clock'
import { format } from 'date-fns'
import SuspenseLoading from '../ui/suspense'

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
    const [selectedType, setSelectedType] = useState<string>(vehicleTypesList[0]?.name || ''); // Initialize with first vehicle type
    const [vehicleList, setVehicleList] = useState<AirportVehicleDetail[]>([])

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const response = await fetch(`/api/airport/refresh-dashboard?zoneId=${selectedZone.zone_id}`)
                if (response.ok) {
                    const data = await response.json()
                    setVehicleTypes(data)
                } else {
                    console.error('Failed to fetch vehicle types');
                }
            } catch (error) {
                console.error('Error fetching vehicle types:', error);
            }
        }

        fetchUpdates()
        const interval = setInterval(fetchUpdates, 10000)

        return () => clearInterval(interval)
    }, [selectedZone])

    useEffect(() => {
        const fetchVehicles = async () => {
            if (!selectedType) {
                setVehicleList([])
                return
            }

            try {
                const response = await fetch(`/api/airport/get-vehicles-dashboard?branchId=${selectedZone.branch_id}&zoneId=${selectedZone.zone_id}&vehicleId=${vehicleTypes.find(v => v.name === selectedType)?.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setVehicleList(data)
                } else {
                    console.error('Failed to fetch vehicle list');
                }
            } catch (error) {
                console.error('Error fetching vehicle list:', error);
            }
        }

        fetchVehicles()
    }, [selectedType, vehicleTypes]) // Dependency on selectedType and vehicleTypes

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <AirportHeader setSelectedZone={setSelectedZone} />

            {/* Vehicle Type Buttons */}
            <VehicleTypes vehicleTypes={vehicleTypes}
                selectedType={selectedType || ''} 
                handleSelectedType={(type) => setSelectedType(type)} />
                
            {/* Vehicle List Summary / With - without pax */}
            <VehicleListSummary vehicleList={vehicleList} />

            {/* Vehicle List */}
            <Suspense fallback={<SuspenseLoading />}>
                <VehicleListDetail vehicleList={vehicleList} />
            </Suspense>
        </div>
    )
}

// New component for the header
function AirportHeader({ setSelectedZone }: { setSelectedZone: (zone: typeof AIRPORT_ZONES[number]) => void }) {
    return (
        <header className="bg-transvip/90 shadow-md p-4 flex flex-col sm:flex-row justify-start items-center gap-2 md:gap-8">
            <div className='w-full flex flex-row items-center justify-start gap-4'>
                <TransvipLogo size={36} colored={false} logoOnly={true} />
                <div className='flex flex-col gap-2 items-center justify-center mx-auto'>
                    <span className="text-2xl font-bold text-white sm:ml-2">Zona Iluminada</span>
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
                <LiveClock className='ml-auto' />
            </div>
        </header>
    )
}

function VehicleTypes({ vehicleTypes, handleSelectedType, selectedType }: { 
    vehicleTypes: AirportVehicleType[]
    handleSelectedType: (arg0: string) => void
    selectedType: string
}) {
    const numVehicleTypes = vehicleTypes.length
    // flex justify-start gap-4
    return (
        <div className={`bg-white shadow-sm p-4 min-h-fit text-base md:text-2xl lg:text-xl grid grid-rows-1 grid-flow-col gap-4 overflow-x-auto snap-start`}>
            { vehicleTypes.map((vType : AirportVehicleType) => (
                <div key={vType.name}
                    onClick={() => handleSelectedType(vType.name)}
                    className={cn('w-[212px] h-[128px] flex flex-col items-center justify-center p-4 rounded-lg transition-colors',
                        selectedType === vType.name ? 'bg-slate-700 hover:bg-slate-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                )}>
                    <div className='flex flex-col items-center gap-2 justify-center'>
                        <span className="text-center text-2xl font-semibold">{vType.name}</span>
                        <span className="text-3xl font-semibold">{vType.count}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

function VehicleListSummary({ vehicleList }: { vehicleList : AirportVehicleDetail[] }) {
    const vehicles_with_passengers = !vehicleList ? 0 : vehicleList.filter(v => v.total_passengers > 0).length
    const vehicles_without_passengers = !vehicleList ? 0 : vehicleList.filter(v => v.total_passengers <= 0 || !v.total_passengers).length

    return (
        <div className='w-full p-3 bg-slate-500 text-white flex justify-center items-center gap-3 text-xl md:text-2xl lg:text-3xl'>
            <div className='flex flex-row gap-1 justify-center items-center'>
                <span className='font-semibold'>Con Pasajeros:</span>
                <span>{ vehicles_with_passengers }</span>
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
        return <div className='w-full p-4 font-bold text-center text-3xl'>Sin resultados</div>
    }

    const maxWaitTime = 15

    return (
        <div className="flex-grow overflow-auto p-3 w-full text-base sm:text-lg xl:text-xl">
            { vehicleList.map((vehicle, index) => {
                const waitTime = vehicle.passenger_entry_time ? calculateDuration(vehicle.passenger_entry_time) : null

                // Determine background color based on wait time
                let bgColor = index % 2 === 0 ? 'bg-gray-50' : 'bg-white'; // Default color
                
                if (waitTime && waitTime >= 10 && waitTime < maxWaitTime) {
                    const intensity = Math.min((waitTime - 10) / (maxWaitTime - 10), 1); // Calculate intensity from 0 to 1
                    bgColor = `bg-gradient-to-r from-yellow-200 to-red-200 opacity-${Math.max(10, Math.round(intensity * 100))}`; // Gradually change to red
                } else if (waitTime && waitTime >= maxWaitTime) {
                    bgColor = 'bg-gradient-to-r from-red-200 to-red-400/80'; // Full red if over max wait time
                }

                return (
                    <div key={vehicle.unique_car_id} 
                        className={`vehicle-detail-card w-full flex flex-row gap-4 items-center justify-between p-4 mb-4 shadow-md rounded-lg text-slate-900 ${bgColor}`}>
                        <div className='vehicle-index font-semibold text-2xl w-[30px] text-center'>{index + 1}</div>
                        <div className='vehicle-info flex flex-row items-center gap-4'>
                            <div className='vehicle-driver flex flex-col gap-1 justify-center items-center w-[220px]'>
                                <div className='flex flex-row gap-1 justify-center items-center'>
                                    <span className="font-semibold">{vehicle.unique_car_id}{vehicle.tipo_contrato === 'Leasing' ? 'L': ''}</span>
                                    { vehicle.name.includes('*') && (
                                        <>
                                            <span>·</span>
                                            <span className="text-blue-600 font-bold">{vehicle.name.includes('*') ? 'D80' : ''}</span>
                                        </>
                                    )}
                                </div>
                                <span className="text-base text-center">{vehicle.fleet_name.trim()}</span>
                            </div>
                            <div className='vehicle-in-zone mx-auto flex flex-col gap-1 justify-center items-center'>
                                <span className='text-center font-semibold'>Tiempo en ZI</span>
                                <div className='flex flex-col md:flex-row gap-1 items-center justify-center'>
                                    <span className="text-center">{format(new Date(vehicle.entry_time), 'dd-MM HH:mm')}</span>
                                    <span className="text-center text-base text-slate-600">({calculateDuration(vehicle.entry_time)} min)</span>
                                </div>
                            </div>
                        </div>
                        <div className='vehicle-pax flex flex-col gap-4 items-center justify-start w-[130px]'>
                            <div className='flex flex-row gap-1 justify-start items-center'>
                                <span className='text-center font-semibold'>Con Pax:</span>
                                <span className="text-center">{vehicle.passenger_entry_time ? `${calculateDuration(vehicle.passenger_entry_time)} min` : '- min'}</span>
                            </div>
                            <div className='flex flex-row gap-1 justify-start items-center'>
                                <span className='text-center font-semibold'>Pasajeros:</span>
                                <span className="text-center">{vehicle.total_passengers ? Math.max(0, vehicle.total_passengers) : 0}</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}