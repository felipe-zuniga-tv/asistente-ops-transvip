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

export default function AirportStatusClient({ vehicleTypesList, zoneId: initialZoneId }: {
    vehicleTypesList: AirportVehicleType[]
    zoneId: number
}) {
    const [vehicleTypes, setvehicleTypes] = useState(vehicleTypesList)
    const [vehicleList, setvehicleList] = useState([])
    const [selectedZone, setSelectedZone] = useState(AIRPORT_ZONES.find(zone => zone.zone_id === initialZoneId) || AIRPORT_ZONES[0])
    const [selectedType, setSelectedType] = useState<string | null>(null); // Update state type

    useEffect(() => {
        const fetchUpdates = async () => {
            console.log(selectedZone)
            const response = await fetch(`/api/airport/refresh-dashboard?zoneId=${selectedZone.zone_id}`)
            if (response.ok) {
                const data = await response.json()
                setvehicleTypes(data)
                if (data.length > 0) {
                    setSelectedType(data[0].name) // Automatically select the first vehicle type
                }
            }
        }

        fetchUpdates() // Fetch immediately when component mounts or zone changes
        const interval = setInterval(fetchUpdates, 10000) // Then every 10 seconds

        return () => clearInterval(interval)
    }, [selectedZone])

    useEffect(() => {
        const fetchVehicles = async () => {
            console.log(`Selected Type: ${selectedType}`)
            const response = await fetch(`/api/airport/get-vehicles-dashboard?branchId=${selectedZone.branch_id}&zoneId=${selectedZone.zone_id}&vehicleId=[2,6]`)
            if (response.ok) {
                const data = await response.json()
                // setvehicleTypes(data)
            }
        }

        fetchVehicles() // Fetch immediately when component mounts or zone changes
        const interval = setInterval(fetchVehicles, 10000) // Then every 10 seconds

        return () => clearInterval(interval)
    }, [selectedType])

    const calculateDuration = (entryTime: String) => {
        const entry = new Date(entryTime as string)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / 60000)
        return `${entryTime} (${diffInMinutes} min)`
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
            {/* <div className="flex-grow overflow-auto p-4 h-4/5_">
                <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th className="py-4 px-4 text-left">#</th>
                            <th className="py-4 px-4 text-left">MÓVIL</th>
                            <th className="py-4 px-4 text-left">CONDUCTOR</th>
                            <th className="py-4 px-4 text-left">ENTRADA</th>
                            <th className="py-4 px-4 text-left">CON PAX</th>
                            <th className="py-4 px-4 text-left">PAX</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicleList.vehicles.map((vehicle, index) => (
                            <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="py-4 px-4">{index + 1}</td>
                                <td className="py-4 px-4">{vehicle.id}</td>
                                <td className="py-4 px-4">{vehicle.driver}</td>
                                <td className="py-4 px-4">{calculateDuration(vehicle.entryTime)}</td>
                                <td className="py-4 px-4">{vehicle.duration}</td>
                                <td className="py-4 px-4">{vehicle.passengers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
        </div>
    )
}
