import { getSession } from "../../auth"
import { branches, vehicleTypes } from "../../config/transvip-general"
import { VEHICLE_STATUS_API_URL, VEHICLE_DETAIL_API_URL } from "../../chat/config/urls"
import { getResponseFromURL, cleanDriverInfo } from "../../chat/utils/helpers"
import { VEHICLE_STATUS } from "@/lib/utils"
import { IVehicleDetail } from "@/lib/types"

// Utility function to get access token
async function getAccessToken() {
    const session = await getSession()
    const currentUser = session?.user as any
    return currentUser?.accessToken as string
}

// Utility function to build URL parameters
function buildUrlParams(params: Record<string, string | number>) {
    return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")
}

// Utility function to map API response to IVehicleDetail
function mapToVehicleDetail(data: any): IVehicleDetail {
    const {
        registration_number: license_plate,
        registration_image,
        permission_of_circulation,
        travel_card_key,
        passenger_insurance_key,
        transportation_permit,
        owner_id, fleet_id,
        assigned_drivers,
        added_at,
        verification_status, verification_comment,
        working_status,
        unique_car_id,
        tipo_contrato, society_name,
        model_id, model_name,
        color_id, color_name, color_code,
        first_name, last_name,
        branch,
        car_type: vehicle_type_id, carName: vehicle_type_name
    } = data

    return {
        vehicle_number: Number(unique_car_id),
        license_plate,
        branch: branches.filter(br => br.name.toUpperCase() === branch)[0],
        status: working_status,
        drivers: assigned_drivers.map((d: any) => cleanDriverInfo(d)),
        creation_datetime: added_at,
        owner: {
            id: owner_id,
            fleet_id,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
        },
        documents: {
            registration_image,
            permission_of_circulation,
            transportation_permit,
            travel_card_key,
            passenger_insurance_key
        },
        verification: {
            status: verification_status,
            comment: verification_comment
        },
        contract: {
            type: tipo_contrato,
            society_name,
        },
        type: {
            id: vehicle_type_id,
            name: vehicle_type_name
        },
        model: {
            id: model_id,
            name: model_name,
        },
        color: {
            id: color_id,
            name: color_name,
            code: color_code,
        }
    }
}

// Utility function to fetch vehicle details with common error handling
async function fetchVehicleDetails(params: Record<string, string | number>) {
    const accessToken = await getAccessToken()
    const urlParams = buildUrlParams({ access_token: accessToken, ...params })
    const { status, data: { final_data } = {} } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?${urlParams}`)
    
    if (status !== 200 || !final_data) return null
    
    const { totalCount, result } = final_data
    if (totalCount === 0) return null
    
    return result
}

export async function getVehicleStatus(vehicleNumber: number) {
    const accessToken = await getAccessToken()
    const params = buildUrlParams({
        access_token: accessToken,
        search_id: vehicleNumber,
    })

    const { status, data } = await getResponseFromURL(`${VEHICLE_STATUS_API_URL}?${params}`)

    if (status === 200 && data.length > 0) {
        const {
            fleet_id, fleet_image,
            first_name, last_name,
            country_code, phone, email,
            is_active, is_available, status,
            current_car_details: license_plate,
            job_id, number_of_passangers: pax_count,
            contract_name, service_name, branch,
            vehicle_image,
        } = data[0]

        return {
            vehicle_number: vehicleNumber,
            message: 'Vehicle Found',
            status: status === 0 ? VEHICLE_STATUS.ONLINE_AVAILABLE : VEHICLE_STATUS.ONLINE_BUSY,
            email: email.trim().toLowerCase(),
            fleet_id, fleet_image,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            driver_name: `${first_name.trim()} ${last_name.trim()}`,
            phone_number: `${country_code.trim()}${phone.trim()}`,
            license_plate, job_id, pax_count,
            contract_name, service_name,
            branch: branches.find(br => br.branch_id === branch),
            is_active, is_available, vehicle_image
        }
    }

    return {
        vehicle_number: vehicleNumber,
        message: 'Vehicle Not Found',
        status: VEHICLE_STATUS.OFFLINE,
    }
}

export async function getVehicleDetail(license_plate: string) {
    if (!license_plate) return null
    const result = await fetchVehicleDetails({
        limit: 1,
        offset: 0,
        search_filter: 1,
        search_value: license_plate
    })
    return result ? mapToVehicleDetail(result[0]) : null
}

export async function getVehicleDetailList(search_string: string) {
    const result = await fetchVehicleDetails({
        limit: 100,
        offset: 0,
        search_filter: 1,
        search_value: search_string
    })
    return result ? result.map(mapToVehicleDetail) : null
}

export async function getVehicleList(branch_id: number, offset = 0, limit = 10) {
    const result = await fetchVehicleDetails({
        branch: branch_id,
        car_status: 1,
        limit,
        offset,
        search_filter: 0
    })
    return result ? result.map(mapToVehicleDetail) : null
}

export async function getAirportMinibusList(airport_code: string) {
    const branch = branches.find(b => b.code.toUpperCase() === airport_code.toUpperCase())
    if (!branch) return null

    const result = await fetchVehicleDetails({
        branch: branch.branch_id,
        car_status: 1,
        limit: 2000,
        offset: 0,
        search_filter: 1,
        search_value: 'Minibus'
    })

    if (!result) return null

    const minibusType = vehicleTypes.find(vt => vt.name.toUpperCase() === 'MINIBUS')
    return result
        .filter((vehicle: { car_type: number }) => vehicle.car_type === minibusType?.id)
        .map(mapToVehicleDetail)
} 