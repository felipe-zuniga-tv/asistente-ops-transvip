import { ALLOWED_VEHICLE_NAMES_PARKING_TICKETS, type AllowedCarName } from "@/utils/constants"
import { getVehicleDetail } from "@/lib/features/vehicle/functions"

interface Vehicle {
    value: string
    label: string
    type: AllowedCarName
}

interface DriverOwnVehicle {
    registration_number: string
    working_status?: number
    unique_car_id: number
    car_name: string
}

interface DriverAssignedVehicle {
    unique_car_id: string
    car_name: string
    car_number: string
}

export async function getDriverVehicleList(driverDetails: any): Promise<Vehicle[]> {
    // Get and process own vehicles
    const ownVehiclesPromises = (driverDetails.car_details || [])
        .filter((v: DriverOwnVehicle) => v.working_status === 1 && 
                v.car_name && 
                ALLOWED_VEHICLE_NAMES_PARKING_TICKETS.includes(v.car_name)
        )
        .map(async (v: DriverOwnVehicle) => {
            const details = await getVehicleDetail(v.registration_number)
            if (!details) return null
            return {
                vehicle_number: v.unique_car_id.toString(),
                license_plate: details.license_plate,
                type: v.car_name
            }
        })

    // Get and process assigned vehicles
    const assignedVehiclesPromises = (driverDetails.assigned_cars || [])
        .filter((v: DriverAssignedVehicle) => v.car_name && ALLOWED_VEHICLE_NAMES_PARKING_TICKETS.includes(v.car_name))
        .map(async (v: DriverAssignedVehicle) => {
            const details = await getVehicleDetail(v.car_number)
            const { vehicle_number, license_plate, status } = details || {}
            
            // Leave only active vehicles
            if (!details || status !== 1) return null

            return {
                vehicle_number: vehicle_number?.toString() || '',
                license_plate: license_plate,
                type: v.car_name
            }
        })

    // Wait for all vehicle details to be fetched
    const [ownVehicles, assignedVehicles] = await Promise.all([
        Promise.all(ownVehiclesPromises),
        Promise.all(assignedVehiclesPromises)
    ])

    console.log(ownVehicles)
    console.log(assignedVehicles)

    // Deduplicate vehicles by value property
    const uniqueVehicles = Array.from(
        new Set([...ownVehicles, ...assignedVehicles].filter(Boolean).map(v => v.value))
    ).map(value => [...ownVehicles, ...assignedVehicles].find(v => v?.value === value)!) as Vehicle[]
    return uniqueVehicles
} 