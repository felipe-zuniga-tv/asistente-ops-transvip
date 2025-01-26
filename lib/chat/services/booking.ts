import { addHours } from "date-fns"
import { getSession } from "../../auth"
import { branches, paymentMethods } from "../../config/transvip-general"
import { BOOKING_DETAIL_URL, BOOKING_ID_API_URL, BOOKING_INFO_FULL_URL } from "../config/urls"
import { getResponseFromURL } from "../utils/helpers"
import { IBookingInfo, IBookingInfoOutput } from "@/lib/types"
import { getVehicleDetail } from "@/lib/services/vehicle"

export const NULL_DATE = '0000-00-00 00:00:00'

export async function getBookingInfo(bookingId: number, isShared: boolean) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const { status, data } = isShared ?
        await getResponseFromURL(`${BOOKING_ID_API_URL}?package_id=${bookingId}&access_token=${accessToken}`) :
        await getResponseFromURL(`${BOOKING_ID_API_URL}?booking_id=${bookingId}&access_token=${accessToken}`)

    if (status !== 200) return null

    const { totalCount, result } = data

    if (totalCount > 0) {
        const output: IBookingInfoOutput[] = []

        await Promise.all(result.map(async (r: IBookingInfo) => {
            const { job_id } = r;

            const { status: status_r, data: data_r } = await getResponseFromURL(`${BOOKING_INFO_FULL_URL}?job_id=${job_id}&access_token=${accessToken}`)
            
            if (status_r !== 200) return

            const {
                job_status, type_of_trip,
                is_round_trip, 
                estimated_payment_cost, payment_amount,
                branch,
                customer_category_name,
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
                job_passenger_country_code,
                temp_pickup_time,
                creation_datetime,
                admin_email,
                assignment_datetime,
                on_road_datetime, on_road_identity,
                arrived_datetime, arrived_identity,
                started_datetime, started_identity,
                completed_datetime, ended_identity,
                no_show_datetime, noshow_identity,
                cancellation_datetime, cancellation_identity, cancellation_reason,
                estimated_distance,
                eta,
                noshow_reason,
                shared_service_id,
                assignment_identity,
                fleet_image,
                payment_method_name,
                qr_link,
                total_distance_travelled,
                total_time_travelled,
                route_details,
                observations,
                fleet_rating, fleet_comment
            } = data_r

            // Get more details about the vehicle, such as type
            const vehicleDetail = await getVehicleDetail(transport_details);

            const pax_full_name = booking_for === 1 ? job_pickup_name : [customer_first_name.trim(), customer_last_name.trim()].join(" ")
            const pax_phone_number = booking_for === 1 ? 
                [customer_country_code.trim(), (job_pickup_phone ?? customer_phone_number.replace(job_passenger_country_code, '').trim())].join("") :
                [customer_country_code.trim(), customer_phone_number.replace(job_passenger_country_code, '').trim()].join("")
        
            const output_item: IBookingInfoOutput = {
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
                    cancellation_identity,
                    cancellation_reason
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
                    actual_payment: payment_amount > 0 ? payment_amount : null,
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
                    vip_flag: (customer_category_name?.toUpperCase() === 'VIP' || customer_category_name?.toUpperCase() === 'SUPERVIP') ?? false,
                    vip_label: !customer_category_name ? 'NO VIP' : customer_category_name.toUpperCase(),
                    full_name: pax_full_name,
                    phone_number: pax_phone_number,
                    email: job_pickup_email,
                },
                rating: {
                    number: fleet_rating,
                    comment: fleet_comment
                }
            };
            output.push(output_item);
        }));

        return output
    }

    return null
}

export async function getBookings(next_x_hours = 2) {
    const session = await getSession()
    const currentUser = session?.user as any
    const accessToken = currentUser?.accessToken as string

    const LIMIT_RESULTS = 30
    const OFFSET_RESULTS = 0
    const HOURS_TO_ADD = next_x_hours

    // DATES
    const START_DATE = new Date()
    const END_DATE = addHours(START_DATE, HOURS_TO_ADD)

    const params = [
        `access_token=${accessToken}`,
        `limit=${LIMIT_RESULTS}`,
        `offset=${OFFSET_RESULTS}`,
        `search_filter=0`,
        `branch_filter=1`,
        `branch_value=1`,
        `date_time_filter=1`,
        `date_time_value1=${START_DATE.toISOString()}`,
        `date_time_value2=${END_DATE.toISOString()}`,
        `job_status_filter=1`,
        `job_status_value=%5B0,6,7,17%5D`,
        `aggrement_filter=0`,
        `booking_status=0`,
        `search_by_agreement_filter=0`,
        `search_user_filter=0`,
        `service_filter=0`,
        `type_of_trip_filter=0`,
        `vehicle_filter=0`,
    ].join("&")

    const response = await getResponseFromURL(`${BOOKING_DETAIL_URL}?${params}`)
    
    const { status, data: { result } } = response

    if (status !== 200) return null

    const output: IBookingInfoOutput[] = []

    await Promise.all(result.map(async (r: any) => {
        const {
            job_id,
            job_status, type_of_trip,
            is_round_trip, 
            estimated_payment_cost, payment_amount,
            branch_name,
            customer_category_name,
            payment_status, 
            fleet_first_name, fleet_last_name, 
            fleet_country_code, fleet_phone_number,
            transport_details, unique_car_id,
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
            creation_datetime,
            admin_email,
            assignment_datetime,
            on_road_datetime, on_road_identity,
            arrived_datetime, arrived_identity,
            started_datetime, started_identity,
            completed_datetime, ended_identity,
            no_show_datetime, noshow_identity,
            cancellation_datetime, cancellation_identity, cancellation_reason,
            estimated_distance,
            eta,
            noshow_reason,
            shared_service_id,
            assignment_identity,
            fleet_image,
            payment_method : payment_method_id,
            qr_link,
            total_distance_travelled,
            total_time_travelled,
            route_details,
            observations,
            fleet_rating, fleet_comment
        } = r

        // Get more details about the vehicle, such as type
        const vehicleDetail = await getVehicleDetail(transport_details);

        const pax_full_name = booking_for === 1 ? job_pickup_name : [customer_first_name.trim(), customer_last_name.trim()].join(" ")
        const pax_phone_number = booking_for === 1 ? customer_country_code.trim() + job_pickup_phone : [customer_country_code.trim(), customer_phone_number.trim()].join("")
    
        const output_item: IBookingInfoOutput = {
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
                cancellation_identity,
                cancellation_reason
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
            branch: branches.find(br => br.name.toUpperCase() === branch_name.toUpperCase()),
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
                estimated_travel_kms: estimated_distance ? estimated_distance / 1000 : null,
                estimated_travel_minutes: eta,
                total_travel_kms: total_distance_travelled,
                total_travel_minutes: total_time_travelled ? total_time_travelled / 60 : null,
            },
            payment: {
                status: payment_status,
                estimated_payment: estimated_payment_cost,
                actual_payment: payment_amount,
                method_name: paymentMethods.find(pm => pm.id === Number(payment_method_id))?.name,
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
                vehicle_number: unique_car_id ? Number(unique_car_id) : null,
                type: vehicleDetail ? vehicleDetail?.type.name : null
            },
            customer: {
                vip_flag: (customer_category_name?.toUpperCase() === 'VIP' || customer_category_name?.toUpperCase() === 'SUPERVIP') ?? false,
                vip_label: !customer_category_name ? 'NO VIP' : customer_category_name.toUpperCase(),
                full_name: pax_full_name,
                phone_number: pax_phone_number,
                email: job_pickup_email,
            },
        };
        output.push(output_item);
    }));

    return output
} 