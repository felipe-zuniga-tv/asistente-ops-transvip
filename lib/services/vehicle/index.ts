import { getSession } from "../../auth"
import { branches, vehicleTypes } from "../../config/transvip-general"
import { VEHICLE_STATUS_API_URL, VEHICLE_DETAIL_API_URL } from "../../chat/config/urls"
import { getResponseFromURL, cleanDriverInfo } from "../../chat/utils/helpers"
import { VEHICLE_STATUS } from "@/lib/utils"
import { IVehicleDetail } from "@/lib/types"

export async function getVehicleStatus(vehicleNumber: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const params = [
        `access_token=${accessToken}`,
        `search_id=${vehicleNumber}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${VEHICLE_STATUS_API_URL}?${params}`)

    if (status === 200 && data.length > 0) {
        const {
            fleet_id,
            fleet_image,
            first_name, last_name,
            country_code, phone,
            email,
            is_active, is_available,
            status,
            current_car_details: license_plate,
            job_id,
            number_of_passangers: pax_count,
            contract_name,
            service_name,
            branch,
            vehicle_image,
        } = data[0]

        return {
            vehicle_number: vehicleNumber,
            message: 'Vehicle Found',
            status: status === 0 ? VEHICLE_STATUS.ONLINE_AVAILABLE : VEHICLE_STATUS.ONLINE_BUSY,
            email: email.trim().toLocaleLowerCase(),
            fleet_id,
            fleet_image,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            driver_name: first_name.trim() + " " + last_name.trim(),
            phone_number: ''.concat(country_code.trim(), phone.trim()),
            license_plate,
            job_id,
            pax_count,
            contract_name,
            service_name,
            branch: branches.filter(br => br.branch_id === branch)[0],
            is_active,
            is_available,
            vehicle_image
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

    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 1
    const OFFSET_RESULTS = 0

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `search_filter=1`,
        `search_value=${license_plate}`
    ].join("&")

    const { status, data: { final_data } } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?${params}`)

    if (status !== 200) return null

    const { totalCount, result } = final_data

    if (totalCount > 0) {
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
        } = result[0]

        const output_item : IVehicleDetail = {
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

        return output_item
    }

    return null
}

export async function getVehicleDetailList(search_string: string) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 100
    const OFFSET_RESULTS = 0

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `search_filter=1`,
        `search_value=${search_string}`
    ].join("&")

    const { status, data: { final_data } } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?${params}`)

    if (status !== 200) return null

    const { totalCount, result } = final_data

    if (totalCount === 0) return null

    const output: IVehicleDetail[] = []

    result.map((r: any) => {
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
        } = r
    
        const output_item : IVehicleDetail = {
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

        output.push(output_item)
    })
    return output
}

export async function getVehicleList(branch_id : number, offset = 0, limit = 10) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const params = [
        `access_token=${accessToken}`,
        `branch=${branch_id}`,
        `car_status=1`,
        `limit=${limit}`,
        `offset=${offset}`,
        `search_filter=0`,
    ].join("&")

    const { status, data: { final_data } } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?${params}`)
    
    if (status !== 200) return null

    const { totalCount, result } = final_data
    if (totalCount === 0) return null

    const output: IVehicleDetail[] = []

    result.map((r: any) => {
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
        } = r

        const output_item : IVehicleDetail = {
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

        output.push(output_item)
    })
    return output
}

export async function getAirportMinibusList(airport_code : string) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 2000
    const OFFSET_RESULTS = 0
    const BRANCH = branches.filter(b => b.code.toUpperCase() === airport_code.toUpperCase())[0]

    const params = [
        `access_token=${accessToken}`,
        `branch=${BRANCH.branch_id}`,
        `car_status=1`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `search_filter=1`,
        `search_value=Minibus`
    ].join("&")

    const { status, data: { final_data } } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?${params}`)

    if (status !== 200) return null

    const { totalCount, result } = final_data

    if (totalCount === 0) return null

    const output: IVehicleDetail[] = []

    result.map((r: any) => {
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
        } = r

        // Filter only minibuses
        if (vehicle_type_id !== vehicleTypes.filter(vt => vt.name.toUpperCase() === 'MINIBUS')[0].id) return
    
        const output_item : IVehicleDetail = {
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

        output.push(output_item)
    })
    return output
} 