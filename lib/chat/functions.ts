import { format, formatISO } from "date-fns";
import { getSession } from "../auth";
import { branches } from "../transvip/config";
import { VEHICLE_STATUS } from "../utils";
import { BookingInfoOutputProps, BookingInfoProps, DriverProfileProps, VehicleDetailProps } from "./types";

// URLs
const VEHICLE_STATUS_API_URL  = buildAPIUrl(process.env.GET_VEHICLE_STATUS);
const VEHICLE_DETAIL_API_URL  = buildAPIUrl(process.env.GET_VEHICLE_DETAIL);
const DRIVER_SEARCH_API_URL   = buildAPIUrl(process.env.SEARCH_DRIVER);
const DRIVER_PROFILE_API_URL  = buildAPIUrl(process.env.GET_DRIVER_PROFILE);
const DRIVER_RATINGS_API_URL  = buildAPIUrl(process.env.GET_DRIVER_RATINGS);
const BOOKING_DETAIL_URL      = buildAPIUrl(process.env.GET_BOOKING_DETAIL);
const BOOKING_INFO_FULL_URL   = buildAPIUrl(process.env.GET_BOOKING_INFO_FULL);
const BOOKING_ID_API_URL      = buildAPIUrl(process.env.GET_BOOKING_BY_ID);
const ZONA_ILUMINADA_CITY     = buildAPIUrl(process.env.GET_ZONA_ILUMINADA_CITY);
const ZONA_ILUMINADA_SERVICES = buildAPIUrl(process.env.GET_ZONA_ILUMINADA_SERVICES);
const AIRPORT_ZONE_API_URL    = buildAPIUrl(process.env.GET_STATUS_AIRPORT_CITY);

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
function addHours(date : Date, hours : number) {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
}
function addMinutes(date : Date, minutes : number) {
    const minutesToAdd = minutes * 60 * 1000;
    date.setTime(date.getTime() + minutesToAdd);
    return date;
}
export function buildWhatsappLink(phone_number : string, text: string) {
    return encodeURI(`https://wa.me/${phone_number.replace('+', '').trim()}?text=${text.trim()}`)
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

        console.log(result[0])

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
export const NULL_DATE = '0000-00-00 00:00:00'
export async function getBookingInfo(bookingId: number, isShared: boolean) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    // console.log(`Reserva: ${bookingId} - Is Shared: ${isShared}`);

    const { status, data } = isShared ?
        await getResponseFromURL(`${BOOKING_ID_API_URL}?package_id=${bookingId}&access_token=${accessToken}`) :
        await getResponseFromURL(`${BOOKING_ID_API_URL}?booking_id=${bookingId}&access_token=${accessToken}`)

    if (status !== 200) return null

    const { totalCount, result } = data

    if (totalCount > 0) {
        const output: BookingInfoOutputProps[] = []

        await Promise.all(result.map(async (r: BookingInfoProps) => {
            const { job_id } = r;

            const { status: status_r, data: data_r } = await getResponseFromURL(`${BOOKING_INFO_FULL_URL}?job_id=${job_id}&access_token=${accessToken}`)
            // console.log(data_r);

            if (status_r !== 200) return

            const {
                job_status, type_of_trip,
                is_round_trip, 
                estimated_payment_cost, payment_amount,
                branch,
                is_vip,
                payment_status, 
                fleet_first_name, fleet_last_name, 
                fleet_country_code, fleet_phone_number,
                transport_details,
                uniqueNo,
                number_of_passangers,
                service_name,
                contract_name,
                customer_first_name, customer_last_name, customer_country_code, customer_phone_number,
                job_pickup_email, job_pickup_name, job_pickup_phone,
                booking_for,
                job_pickup_address, job_pickup_latitude, job_pickup_longitude,
                job_address, job_latitude, job_longitude,
                job_time, job_time_utc,
                temp_pickup_time,
                creation_datetime, // UTC time
                admin_email,
                assignment_datetime,
                on_road_datetime, on_road_identity,
                arrived_datetime, arrived_identity,
                started_datetime, started_identity,
                completed_datetime, ended_identity,
                no_show_datetime, noshow_identity,
                cancellation_datetime,
                estimated_distance,
                eta,
                noshow_reason,
                shared_service_id,
                assignment_identity,
                fleet_image, // URL
                payment_method_name,
                qr_link,
                total_distance_travelled, // kms
                total_time_travelled, // segundos
                route_details,
                observations,
                fleet_rating, fleet_comment
            } = data_r

            // Get more details about the vehicle, such as type
            const vehicleDetail = await getVehicleDetail(transport_details);

            const pax_full_name = booking_for === 1 ? job_pickup_name : [customer_first_name.trim(), customer_last_name.trim()].join(" ")
            const pax_phone_number = booking_for === 1 ? customer_country_code.trim() + job_pickup_phone : [customer_country_code.trim(), customer_phone_number.trim()].join("")
        
            const output_item: BookingInfoOutputProps = {
                booking: {
                    id: job_id,
                    status: job_status,
                    type_of_trip,
                    is_round_trip: is_round_trip === 1,
                    pax_count: number_of_passangers,
                    shared_service_id,
                    service_name,
                    contract_name,
                    booking_for: booking_for === 1,
                    qr_link,
                    observations,
                    no_show_reason: noshow_reason,
                    no_show_identity: noshow_identity,
                    creation_identity: admin_email,
                    assignment_identity,
                    on_road_identity,
                    arrived_identity,
                    started_identity,
                    ended_identity,
                },
                dates: {
                    creation_datetime: creation_datetime === NULL_DATE ? null : creation_datetime,
                    job_time: job_time === NULL_DATE ? null : job_time,
                    job_time_utc: job_time_utc === NULL_DATE ? null : job_time_utc,
                    temp_pickup_time: temp_pickup_time === NULL_DATE ? null : temp_pickup_time,
                    assignment_datetime: assignment_datetime === NULL_DATE ? null : assignment_datetime,
                    on_road_datetime: on_road_datetime === NULL_DATE ? null : on_road_datetime,
                    arrived_datetime: arrived_datetime === NULL_DATE ? null : arrived_datetime,
                    started_datetime: started_datetime === NULL_DATE ? null : started_datetime,
                    completed_datetime: completed_datetime === NULL_DATE ? null : completed_datetime,
                    no_show_datetime: no_show_datetime === NULL_DATE ? null : no_show_datetime,
                    cancellation_datetime: cancellation_datetime === NULL_DATE ? null : cancellation_datetime,
                },
                branch: branches.find(br => br.branch_id === Number(branch)),
                directions: {
                    origin: {
                        address: job_pickup_address.trim(),
                        latitude: job_pickup_latitude,
                        longitude: job_pickup_longitude,
                    },
                    destination: {
                        address: job_address.trim(),
                        latitude: job_latitude,
                        longitude: job_longitude
                    },
                    estimated_travel_kms: estimated_distance / 1000,
                    estimated_travel_minutes: eta,
                    total_travel_kms: total_distance_travelled,
                    total_travel_minutes: total_time_travelled / 60,
                },
                payment: {
                    status: payment_status,
                    estimated_payment: estimated_payment_cost,
                    actual_payment: payment_amount,
                    method_name: payment_method_name,
                    fare_route_name: route_details.route_name,
                    fare_route_type: route_details.route_type
                },
                fleet: {
                    image: fleet_image,
                    first_name: fleet_first_name ? fleet_first_name.trim() : "",
                    last_name: fleet_last_name ? fleet_last_name.trim() : "",
                    full_name: fleet_first_name && fleet_last_name ? [fleet_first_name.trim(), fleet_last_name.trim()].join(" ") : "",
                    phone_number: fleet_country_code && fleet_phone_number ? [fleet_country_code.trim(), fleet_phone_number.trim()].join("") : "",
                },
                vehicle: {
                    license_plate: transport_details,
                    vehicle_number: Number(uniqueNo),
                    type: vehicleDetail?.type.name
                },
                customer: {
                    // first_name: customer_first_name.trim(),
                    // last_name: customer_last_name.trim(),
                    vip_flag: is_vip === 1,
                    full_name: pax_full_name,
                    phone_number: pax_phone_number,
                    email: job_pickup_email,
                },
                rating: {
                    number: fleet_rating,
                    comment: fleet_comment
                }
            };
            // console.log(output_item)

            output.push(output_item);
        }));

        return output
    }

    return null
}

export async function getBookings() {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 25
    const OFFSET_RESULTS = 0
    const HOURS_TO_ADD = 2
    const DATE_FORMAT = "yyyy-MM-ddTHH:mm:ss"

    // DATES
    const START_DATE = new Date()
    const END_DATE = addHours(START_DATE, HOURS_TO_ADD)

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `search_filter=0`,
        // `search_value=${license_plate}`,
        `branch_filter=1`,
        `branch_value=1`,
        `date_time_filter=1`,
        `date_time_value1=${formatISO(START_DATE)}`,
        `date_time_value2=${formatISO(END_DATE)}`,
        // `date_time_value1=${format(START_DATE, DATE_FORMAT)}`,
        // `date_time_value2=${format(END_DATE, DATE_FORMAT)}`,
        `job_status_filter=1`,
        `job_status_value=%5B0,6,7,17%5D`,
        `aggrement_filter=0`,
        `booking_status=0`,
        `search_by_agreement_filter=0`,
        `search_filter=0`,
        `search_user_filter=0`,
        `service_filter=0`,
        `type_of_trip_filter=0`,
        `vehicle_filter=0`,
    ].join("&")

    console.log(`${BOOKING_DETAIL_URL}?${params}`)

    const response = await getResponseFromURL(`${BOOKING_DETAIL_URL}?${params}`)
    // const { status, data: { final_data } } = await getResponseFromURL(`${BOOKING_DETAIL_URL}?${params}`)

    console.log(response)
    
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

// Zona Iluminada
export async function getZonaIluminada(cityName = 'Santiago') {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const branchId = branches.filter(x => x.name === cityName)[0].branch_id
    
    const params = [
        `access_token=${accessToken}`,
        `branch_id=${branchId}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${ZONA_ILUMINADA_CITY}?${params}`)

    if (status !== 200) return

    const { data: results } = data

    return {
        branch_id: branchId,
        regions: results
    }
}
export async function getZonaIluminadaServices(zone_id: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string
    
    const params = [
        `access_token=${accessToken}`,
        `zone_id=${zone_id}`,
    ].join("&")

    const { status, data } = await getResponseFromURL(`${ZONA_ILUMINADA_SERVICES}?${params}`)

    if (status !== 200) return

    const { data: results } = data

    return results
}

export async function getAirportStatus(zone: any) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    // const branchId = branches.filter(x => x.name === cityName)[0].branch_id

    const params = [
        `access_token=${accessToken}`,
        `branch_id=${zone.branch_id}`,
        `zone_id=${zone.region.region_id}`,

    ].join("&")

    // const { status, data } = await getResponseFromURL(`${AIRPORT_ZONE_API_URL}?${params}`)

    // if (status !== 200) return null

    // const { driver_detail } = data
//     access_token: 18917535fb6b9366ad8d3650666c26b5
// branch_id: 1
// limit: 10
// offset: 0
// vehicle_id: [1,5,7]
// zone_id: 2

} 