import { format } from "date-fns";
import { getSession } from "../lib";
import { branches } from "../transvip/config";
import { VEHICLE_STATUS } from "../utils";
import { BookingInfoOutputProps, BookingInfoProps, DriverProfileProps, VehicleDetailProps } from "./types";

// URLs
const VEHICLE_STATUS_API_URL = buildAPIUrl(process.env.GET_VEHICLE_STATUS);
const VEHICLE_DETAIL_API_URL = buildAPIUrl(process.env.GET_VEHICLE_DETAIL);
const DRIVER_SEARCH_API_URL  = buildAPIUrl(process.env.SEARCH_DRIVER);
const DRIVER_PROFILE_API_URL = buildAPIUrl(process.env.GET_DRIVER_PROFILE);
const DRIVER_RATINGS_API_URL = buildAPIUrl(process.env.GET_DRIVER_RATINGS);
const BOOKING_ID_API_URL     = buildAPIUrl(process.env.GET_BOOKING_BY_ID);

// AUX FUNCTIONS
function buildAPIUrl(endpoint: string | undefined) {
    return `${process.env.API_BASE_URL}/${endpoint}`
}
async function getResponseFromURL(URL: string) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'content-language': 'es'
            }
        };
        const response = await fetch(URL, options)
        const output = await response.json()

        return output
    } catch (e) {
        console.log(e)
        return null
    }
}

// FUNCTIONS
// Vehicles
export async function getVehicleStatus(vehicleNumber: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const params = [
        `access_token=${accessToken}`,
        `search_id=${vehicleNumber}`,
    ].join("&")

    const output = await getResponseFromURL(`${VEHICLE_STATUS_API_URL}?${params}`)

    if (output.data.length > 0) {
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
        } = output.data[0]

        return {
            vehicle_number: vehicleNumber,
            message: 'Vehicle Found',
            status: status === 0 ? VEHICLE_STATUS.ONLINE_AVAILABLE : VEHICLE_STATUS.ONLINE_BUSY, // 1 - Online
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
        status: VEHICLE_STATUS.OFFLINE, // 0 - Offline
    }
}

export async function getVehicleDetail(license_plate: string) {
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
            assigned_drivers, // array
            added_at,
            verification_status, verification_comment, // último comentario?
            working_status, // 0 - Inactivo, 1: Activo
            unique_car_id,
            tipo_contrato, society_name,
            model_id, model_name,
            color_id, color_name, color_code,
            first_name, last_name,
            branch, 
            car_type: vehicle_type_id, carName: vehicle_type_name
        } = result[0]

        const output_item : VehicleDetailProps = {
            vehicle_number: Number(unique_car_id),
            license_plate,
            branch: branches.filter(br => br.name.toUpperCase() === branch)[0],
            status: working_status,
            drivers: assigned_drivers,
            creation_datetime: added_at,
            owner: {
                id: owner_id,
                fleet_id,
                first_name,
                last_name,
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

// Bookings
export async function getBookingInfo(bookingId: number, isShared: boolean) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    // console.log(`Reserva: ${bookingId} - Is Shared: ${isShared}`);

    const { status, data } = isShared ?
        await getResponseFromURL(`${BOOKING_ID_API_URL}?package_id=${bookingId}&access_token=${accessToken}`) :
        await getResponseFromURL(`${BOOKING_ID_API_URL}?booking_id=${bookingId}&access_token=${accessToken}`)

    console.log(data)

    if (status !== 200) return null

    const { totalCount, result } = data

    if (totalCount > 0) {
        const output: BookingInfoOutputProps[] = []

        await Promise.all(result.map(async (r: BookingInfoProps) => {
            const {
                job_id, job_status, type_of_trip,
                is_round_trip, estimated_payment_cost,
                branch,
                is_VIP,
                payment_status,
                job_time, job_time_utc,
                fleet_first_name, fleet_last_name, 
                fleet_country_code, fleet_phone_number,
                transport_details,
                unique_car_id,
                number_of_passangers,
                service_name,
                contract_name,
                customer_first_name, customer_last_name, customer_country_code, customer_phone_number,
                job_pickup_email,
                booking_for,
                creation_datetime, // UTC time
                job_pickup_address, job_address, eta,
                shared_service_id
            } = r;
        
            // Get more details about the vehicle, such as type
            const vehicleDetail = await getVehicleDetail(transport_details);
        
            const output_item: BookingInfoOutputProps = {
                booking: {
                    id: job_id,
                    status: job_status,
                    type_of_trip,
                    is_round_trip,
                    pax_count: number_of_passangers,
                    job_time,
                    job_time_utc,
                    creation_datetime, // UTC time
                    shared_service_id,
                    service_name,
                    contract_name,
                    booking_for,
                },
                branch: branches.find(br => br.branch_id === Number(branch)),
                directions: {
                    origin: job_pickup_address.trim(),
                    destination: job_address.trim(),
                    estimated_travel_time: eta
                },
                payment: {
                    status: payment_status,
                    estimated_payment: estimated_payment_cost
                },
                fleet: {
                    first_name: fleet_first_name ? fleet_first_name.trim() : "",
                    last_name: fleet_last_name ? fleet_last_name.trim() : "",
                    full_name: fleet_first_name && fleet_last_name ? [fleet_first_name.trim(), fleet_last_name.trim()].join(" ") : "",
                    phone_number: fleet_country_code && fleet_phone_number ? [fleet_country_code.trim(), fleet_phone_number.trim()].join("") : "",
                },
                vehicle: {
                    license_plate: transport_details,
                    vehicle_number: Number(unique_car_id),
                    type: vehicleDetail?.type.name
                },
                customer: {
                    vip_flag: is_VIP === 1,
                    first_name: customer_first_name.trim(),
                    last_name: customer_last_name.trim(),
                    full_name: [customer_first_name.trim(), customer_last_name.trim()].join(" "),
                    phone_number: [customer_country_code.trim(), customer_phone_number.trim()].join(""),
                    email: job_pickup_email,
                },
            };

            output.push(output_item);
        }));

        return output
    }

    return null
}

// Drivers
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
        car_details, // []
        assigned_cars, // []
    } = driver_detail

    const output_item : DriverProfileProps = {
        id: driver_id,
        created_at: creation_datetime,
        last_login,
        branch: branches.filter(br => br.branch_id === branch)[0],
        current_license_plate: current_car_details,
        invoice_rut: invoice_rut ? invoice_rut.toUpperCase() : '',
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
        assigned_cars,
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