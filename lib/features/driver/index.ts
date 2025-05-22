'use server'

import { format } from "date-fns"
import { branches } from "@/lib/core/config/transvip-general"
import { DRIVER_SEARCH_API_URL, DRIVER_PROFILE_API_URL, DRIVER_RATINGS_API_URL } from "@/lib/core/config/urls"
import { getResponseFromURL, getAssignedVehicles } from "@/lib/core/utils/helpers"
import type { DriverDetails, DriverRating } from '@/types/domain/driver/types'
import { getAccessToken, buildUrlParams } from "@/utils/helpers"

const MAX_RESULTS = 10

export async function searchDriver(driverEmail: string, accessToken: string | null = null) {
    if (!accessToken) {
        accessToken = await getAccessToken()
    }

    if (!accessToken) {
        throw new Error('No se pudo obtener el token de acceso')
    }

    const LIMIT_RESULTS = 1
    const OFFSET_RESULTS = 0

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `driver_type=0`,
        `driver_status=1`,
        `search_filter=1`,
        `search_value=${driverEmail}`
    ].join("&")

    const { status, data } = await getResponseFromURL(`${DRIVER_SEARCH_API_URL}?${params}`)
    
    if (status !== 200) return null
    
    const { result } = data

    if (result.length > 0) {
        return result[0]
    }

    return null
}

export async function searchDrivers({ limit = 10, offset = 0 }: { limit?: number, offset?: number }) {
    const accessToken = await getAccessToken()

    const LIMIT_RESULTS = limit
    const OFFSET_RESULTS = offset

    const params = buildUrlParams({
        access_token: accessToken,
        limit: LIMIT_RESULTS,
        offset: OFFSET_RESULTS,
        driver_type: 0,
        driver_status: 1,
        search_filter: 0,
    })

    const { status, data } = await getResponseFromURL(`${DRIVER_SEARCH_API_URL}?${params}`)

    if (status !== 200) return null

    const { result } = data
    return result.length > 0 ? result : null
}

export async function getDriverProfile(fleet_id: number, accessToken: string | null = null): Promise<DriverDetails | null> {
    if (!accessToken) {
        try {
            accessToken = await getAccessToken()
        } catch {
            const envToken = process.env.TOKEN_FINANCE_PARKING_TICKETS
            accessToken = envToken || null
        }
    }

    if (!accessToken) {
        throw new Error('No se pudo obtener el token de acceso')
    }

    const params = [
        `access_token=${accessToken}`,
        `fleet_id=${fleet_id}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${DRIVER_PROFILE_API_URL}?${params}`)

    if (status !== 200) return null

    const { driver_detail } = data

    const {
        fleet_id: driver_id,
        branch,
        GaussControl_ID, GaussControl_IBC, GaussControl_NFA, GaussControl_LastUpdate, GaussControl_timezone,
        first_name, last_name, email, country_code, phone,
        fleet_image,
        registration_status, verification_status,
        is_active, is_available, is_blocked, is_blocked_gauss,
        status: driver_status,
        total_rating, total_rated_tasks,
        creation_datetime,
        last_login_datetime: last_login,
        RUT, RUT_image,
        license_type, license_expiry_date, license_img,
        life_sheet_img, antecents_certificate,
        current_car_details,
        invoice_rut,
        car_details,
        assigned_cars,
    } = driver_detail

    // console.log(assigned_cars)

    const output_item: DriverDetails = {
        id: driver_id,
        created_at: creation_datetime,
        last_login,
        branch: branches.filter(br => br.branch_id === branch)[0],
        current_license_plate: current_car_details,
        invoice_rut: invoice_rut.toUpperCase() || '',
        personal: {
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            full_name: first_name.trim() + " " + last_name.trim(),
            phone: country_code.trim() + phone.trim(),
            email: email.toLocaleLowerCase(),
            image: fleet_image,
        },
        status: {
            registration_status,
            verification_status,
            is_active,
            is_available,
            is_blocked,
            is_blocked_gauss,
            current: driver_status,
        },
        quality: {
            total_rating,
            rated_trips: total_rated_tasks,
            avg_rating: total_rating / total_rated_tasks,
        },
        safety: {
            GaussControl: {
                id: GaussControl_ID,
                IBC: GaussControl_IBC,
                NFA: GaussControl_NFA,
                last_updated_at: GaussControl_LastUpdate,
                timezone: GaussControl_timezone
            }
        },
        driver_documents: {
            RUT: {
                number: RUT,
                image: RUT_image,
            },
            license: {
                type: license_type,
                expiration_date: license_expiry_date,
                image: license_img,
            },
            life_sheet: {
                image: life_sheet_img
            },
            background: {
                image: antecents_certificate,
            }
        },
        vehicles: car_details,
        assigned_vehicles: assigned_cars.map((c: any) => getAssignedVehicles(c)),
    }

    return output_item
}

export async function getDriverRatings(fleet_id: number, accessToken: string | null = null) {
    if (!accessToken) {
        try {
            accessToken = await getAccessToken()
        } catch {
            const envToken = process.env.TOKEN_FINANCE_PARKING_TICKETS
            accessToken = envToken || null
        }
    }

    if (!accessToken) {
        throw new Error('No se pudo obtener el token de acceso')
    }

    const OFFSET_DAYS = 90
    const DATE_FORMAT = "yyyy-MM-dd"

    // DATES
    const END_DATE = new Date()
    const TODAY = new Date()
    const START_DATE = TODAY.setDate(TODAY.getDate() - OFFSET_DAYS)

    const params = [
        `access_token=${accessToken}`,
        `fleet_id=${fleet_id}`,
        `startDate=${format(START_DATE, DATE_FORMAT)}`,
        `endDate=${format(END_DATE, DATE_FORMAT)}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${DRIVER_RATINGS_API_URL}?${params}`)

    if (status !== 200) return null

    return data
}

export const getDriverRatingSummary = async (driverRatings: DriverRating[]): Promise<Record<string, { count: number; comments: Record<string, number> }>> => {
    const summary = driverRatings.reduce((acc, job) => {
        const rating = job.fleet_rating.toString();
        if (!acc[rating]) {
            acc[rating] = { count: 0, comments: {} };
        }
        acc[rating].count++;
        const comment = job.fleet_comment;
        if (!acc[rating].comments[comment]) {
            acc[rating].comments[comment] = 0; // Create an entry if it doesn't exist
        }
        acc[rating].comments[comment]++; // Increment the comment count

        return acc;
    }, {} as Record<string, { count: number; comments: Record<string, number> }>);

    return summary
}
