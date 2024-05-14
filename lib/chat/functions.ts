import { getSession } from "../lib";
import { branches } from "../transvip/config";
import { VEHICLE_STATUS } from "../utils";

// URLs
const VEHICLE_STATUS_API_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_VEHICLE_STATUS}`;
const VEHICLE_DETAIL_API_URL = `${process.env.API_BASE_URL}/${process.env.API_ADMIN_VEHICLE_DETAIL}`;
const BOOKING_ID_API_URL = `${process.env.API_BASE_URL}/${process.env.API_SEARCH_BOOKING_BY_ID}`;

// DATA TYPES
export interface BranchProps {
    branch_id: number;
    name: string;
    code: string;
}
export interface VehicleStatusSearchResultProps {
    vehicle_number: string;
    message: string;
    status: number
     // 0 - Online Free / 1 - Online Busy / Nada: offline
    fleet_id: number;
    email: string;
    first_name: string;
    last_name: string;
    driver_name: string;
    phone_number: string;
    fleet_image: string;
    is_active: number;
    is_available: number;
    license_plate: string;
    job_id?: number;
    pax_count: number;
    branch: BranchProps;
    contract_name: string;
    service_name: string;
    vehicle_image: string
}
export interface BookingInfoProps {
    job_id: number
    job_status: number
    type_of_trip: string
    is_round_trip: number
    estimated_payment_cost: number
    branch: string,
    is_VIP: number
    payment_status: number
    job_time: string
    job_time_utc: string
    fleet_first_name: string
    fleet_last_name: string
    fleet_country_code: string
    fleet_phone_number: string
    transport_details: string
    unique_car_id: string
    number_of_passangers: string
    service_name: string
    contract_name: string
    customer_first_name: string
    customer_last_name: string
    customer_country_code: string
    customer_phone_number: string
    job_pickup_email: string
    booking_for: string
    creation_datetime: string
    job_pickup_address: string
    job_address: string
    eta: number,
    shared_service_id: string | undefined
}
export interface BookingInfoOutputProps {
    booking: {
        id: number
        status: number
        type_of_trip: string
        is_round_trip: number
        pax_count: string
        job_time: string
        job_time_utc: string
        creation_datetime: string
        shared_service_id: string | undefined
        service_name: string
        contract_name: string
        booking_for: string;
    }
    branch: {
        branch_id: number
        name: string
        code: string;
    }
    directions: { 
        origin: string
        destination: string
        eta: number
    }
    payment: {
        status: number
        estimated_payment: number
    }
    fleet: {
        first_name: string
        last_name: string
        full_name: string
        phone_number: string
    }
    vehicle: {
        license_plate: string
        vehicle_number: number
    }
    customer: {
        vip_flag: boolean
        first_name: string
        last_name: string
        full_name: string
        phone_number: string
        email: string
    };
}
export interface VehicleDetailProps {
    vehicle_number: number,
    license_plate: string,
    branch: BranchProps,
    status: number,
    drivers: VehicleDetailDriversProps[],
    creation_datetime: string,
    owner: {
        id: number,
        fleet_id: number,
        first_name: string,
        last_name: string,
    },
    documents: {
        registration_image: string,
        permission_of_circulation: string,
        transportation_permit: string,
        travel_card_key: string,
        passenger_insurance_key: string
    },
    verification: {
        status: number,
        comment: string
    },
    contract: {
        type: string,
        society_name: string,
    },
    type: {
        id: number,
        name: string  
    },
    model: {
        id: number,
        name: string,
    },
    color: {
        id: number,
        name: string,
        code: string,
    }
}
export interface VehicleDetailDriversProps {
    fleet_id: number,
    first_name: string
    last_name: string,
    country_code: string,
    phone: string
}

// AUX FUNCTIONS
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
export async function getVehicleStatus(vehicleNumber: number) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    // console.log('CURRENT SESSION');
    // console.log(currentUser);

    const output = await getResponseFromURL(`${VEHICLE_STATUS_API_URL}?search_id=${vehicleNumber}&access_token=${accessToken}`)

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

export async function getBookingInfo(bookingId: number, isShared: boolean) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    // console.log(`Reserva: ${bookingId} - Is Shared: ${isShared}`);

    const { status, data } = isShared ?
        await getResponseFromURL(`${BOOKING_ID_API_URL}?package_id=${bookingId}&access_token=${accessToken}`) :
        await getResponseFromURL(`${BOOKING_ID_API_URL}?booking_id=${bookingId}&access_token=${accessToken}`)

    // console.log(data)

    if (status !== 200) return null

    const { totalCount, result } = data

    if (totalCount > 0) {
        const output: BookingInfoOutputProps[] = []

        result.forEach((r: BookingInfoProps) => {
            const {
                job_id, job_status, type_of_trip,
                is_round_trip, estimated_payment_cost,
                branch,
                is_VIP,
                payment_status,
                job_time, job_time_utc,
                fleet_first_name, fleet_last_name, fleet_country_code, fleet_phone_number,
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
            } = r

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
                branch: branches.filter(br => br.branch_id === Number(branch))[0],
                directions: {
                    origin: job_pickup_address.trim(),
                    destination: job_address.trim(),
                    eta
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
                },
                customer: {
                    vip_flag: is_VIP === 1,
                    first_name: customer_first_name.trim(),
                    last_name: customer_last_name.trim(),
                    full_name: [customer_first_name.trim(), customer_last_name.trim()].join(" "),
                    phone_number: [customer_country_code.trim(), customer_phone_number.trim()].join(""),
                    email: job_pickup_email,
                },
            }

            output.push(output_item)
        });

        return output
    }

    return null
}

export async function getVehicleDetail(license_plate: string) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 1
    const OFFSET_RESULTS = 0

    const { status, data: { final_data } } = await getResponseFromURL(`${VEHICLE_DETAIL_API_URL}?access_token=${accessToken}&limit=${LIMIT_RESULTS}&offset=${OFFSET_RESULTS}&search_filter=1&search_value=${license_plate}`)

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