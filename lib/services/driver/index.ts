import { format } from "date-fns"
import { getSession } from "../../auth"
import { branches } from "../../config/transvip-general"
import { DRIVER_SEARCH_API_URL, DRIVER_PROFILE_API_URL, DRIVER_RATINGS_API_URL } from "../../chat/config/urls"
import { getResponseFromURL, getAssignedVehicles } from "../../chat/utils/helpers"
import { IDriverProfile } from "@/lib/types"

export async function searchDriver(driver_email: string) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 1
    const OFFSET_RESULTS = 0

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `driver_type=0`,
        `driver_status=1`,
        `search_filter=1`,
        `search_value=${driver_email}`
    ].join("&")

    const { status, data } = await getResponseFromURL(`${DRIVER_SEARCH_API_URL}?${params}`)

    if (status !== 200) return null

    const { customerCount, result } = data
    
    if (customerCount > 0) {
        return result[0].fleet_id
    }

    return null
}

export async function getDriverProfile(fleet_id: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

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

    const output_item : IDriverProfile = {
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

export async function getDriverRatings(fleet_id: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

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