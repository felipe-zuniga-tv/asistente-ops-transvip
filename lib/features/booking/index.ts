'use server'
import { addHours } from "date-fns"
import { getSession } from "@/lib/core/auth"
import { branches, paymentMethods } from "@/lib/core/config"
import { BOOKING_DETAIL_URL, BOOKING_ID_API_URL, BOOKING_INFO_FULL_URL } from "@/lib/core/config/urls"
import { getResponseFromURL } from "@/lib/core/utils/helpers"
import { IBookingInfo, IBookingInfoOutput } from "@/types/domain/chat/models"
import { getVehicleDetail } from "../../features/vehicle/functions"

const NULL_DATE = '0000-00-00 00:00:00'

interface DateFields {
    creation_datetime: string;
    job_time: string;
    job_time_utc: string;
    temp_pickup_time: string;
    assignment_datetime: string;
    on_road_datetime: string;
    arrived_datetime: string;
    started_datetime: string;
    completed_datetime: string;
    no_show_datetime: string;
    cancellation_datetime: string;
}

function formatPhoneNumber(countryCode: string, phoneNumber: string, passengerCountryCode?: string): string {
    const cleanCountryCode = countryCode.trim();
    const cleanPhoneNumber = phoneNumber.replace(passengerCountryCode || '', '').trim();
    return [cleanCountryCode, cleanPhoneNumber].join('');
}

function formatFullName(firstName?: string, lastName?: string): string {
    if (!firstName && !lastName) return '';
    return [firstName?.trim() || '', lastName?.trim() || ''].filter(Boolean).join(' ');
}

function processDateFields(dates: DateFields) {
    return Object.entries(dates).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value === NULL_DATE ? null : value
    }), {} as Record<string, string | null>);
}

async function mapBookingToOutput(bookingData: any, vehicleDetail: any): Promise<IBookingInfoOutput> {
    const {
        job_id,
        job_status,
        type_of_trip,
        is_round_trip,
        estimated_payment_cost,
        payment_amount,
        branch,
        branch_name,
        creation_identity,
        customer_category_name,
        payment_status,
        fleet_first_name,
        fleet_last_name,
        fleet_country_code,
        fleet_phone_number,
        transport_details,
        uniqueNo,
        unique_car_id,
        number_of_passangers,
        service_name,
        contract_name,
        customer_first_name,
        customer_last_name,
        customer_country_code,
        customer_phone_number,
        job_pickup_email,
        job_pickup_name,
        job_pickup_phone,
        booking_for,
        job_pickup_address,
        job_pickup_latitude,
        job_pickup_longitude,
        job_address,
        job_latitude,
        job_longitude,
        estimated_distance,
        eta,
        noshow_reason,
        shared_service_id,
        assignment_identity,
        on_road_identity,
        arrived_identity,
        started_identity,
        completed_identity,
        noshow_identity: no_show_identity,
        cancellation_identity,
        fleet_image,
        payment_method_id,
        payment_method_name,
        qr_link,
        total_distance_travelled,
        total_time_travelled,
        route_details,
        observations,
        fleet_rating,
        fleet_comment,
        ...dateFields
    } = bookingData;

    const isBookingForPax = booking_for === 1;
    const paxFullName = isBookingForPax ? 
        job_pickup_name : 
        formatFullName(customer_first_name, customer_last_name);
    
    const paxPhoneNumber = isBookingForPax ?
        formatPhoneNumber(customer_country_code, job_pickup_phone || customer_phone_number) :
        formatPhoneNumber(customer_country_code, customer_phone_number);

    const processedDates = processDateFields(dateFields as DateFields);

    return {
        booking: {
            id: job_id,
            status: job_status,
            type_of_trip,
            is_round_trip: is_round_trip === 1,
            pax_count: number_of_passangers,
            shared_service_id,
            service_name,
            contract_name,
            booking_for: isBookingForPax,
            qr_link,
            observations,
            assignment_identity,
            on_road_identity,
            arrived_identity,
            started_identity,
            completed_identity,
            no_show_identity,
            cancellation_identity,
            no_show_reason: noshow_reason,
            ...Object.entries(dateFields)
                .filter(([key]) => key.includes('identity'))
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
        },
        dates: processedDates,
        branch: branches.find(br => 
            br.branch_id === Number(branch) || 
            br.name.toUpperCase() === branch_name?.toUpperCase()
        ),
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
            actual_payment: payment_amount > 0 ? payment_amount : null,
            method_name: payment_method_name || paymentMethods.find(pm => pm.id === Number(payment_method_id))?.name,
            ...(route_details && {
                fare_route_name: route_details.route_name,
                fare_route_type: route_details.route_type
            })
        },
        fleet: {
            image: fleet_image,
            first_name: fleet_first_name?.trim() || '',
            last_name: fleet_last_name?.trim() || '',
            full_name: formatFullName(fleet_first_name, fleet_last_name),
            phone_number: fleet_country_code && fleet_phone_number ? 
                formatPhoneNumber(fleet_country_code, fleet_phone_number) : '',
        },
        vehicle: {
            license_plate: transport_details,
            vehicle_number: Number(uniqueNo || unique_car_id) || null,
            type: vehicleDetail?.type.name
        },
        customer: {
            vip_flag: (customer_category_name?.toUpperCase() === 'VIP' || 
                      customer_category_name?.toUpperCase() === 'SUPERVIP') ?? false,
            vip_label: customer_category_name?.toUpperCase() || 'NO VIP',
            full_name: paxFullName,
            phone_number: paxPhoneNumber,
            email: job_pickup_email,
        },
        ...(fleet_rating && { rating: {
            number: fleet_rating,
            comment: fleet_comment
        }})
    };
}

export async function getBookingInfo(bookingId: number, isShared: boolean) {
    const session = await getSession();
    const accessToken = (session?.user as any)?.accessToken;
    if (!accessToken) return null;

    const params = isShared ? 
        { package_id: bookingId, access_token: accessToken } : 
        { booking_id: bookingId, access_token: accessToken };

    const { status, data } = await getResponseFromURL(
        `${BOOKING_ID_API_URL}?${new URLSearchParams(params as any).toString()}`
    );

    if (status !== 200 || data.totalCount === 0) return null;

    if (!BOOKING_INFO_FULL_URL) {
        console.error('Booking Info Full URL is not configured');
        return null;
    }

    const output: IBookingInfoOutput[] = await Promise.all(
        data.result.map(async (booking: IBookingInfo) => {
            const { job_id } = booking;
            const { status: detailStatus, data: detailData } = await getResponseFromURL(
                `${BOOKING_INFO_FULL_URL}?job_id=${job_id}&access_token=${accessToken}`
            );

            if (detailStatus !== 200) return null;

            const vehicleDetail = await getVehicleDetail(detailData.transport_details);
            return mapBookingToOutput(detailData, vehicleDetail);
        })
    );

    return output.filter(Boolean);
}

export async function getBookings(next_x_hours = 2) {
    const session = await getSession();
    const accessToken = (session?.user as any)?.accessToken;
    if (!accessToken) return null;

    if (!BOOKING_DETAIL_URL) {
        console.error('Booking Detail URL is not configured');
        return null;
    }

    const searchParams = {
        limit: 20,
        offset: 0,
        search_filter: 0,
        branch_filter: 0,
        // branch_value: '1',
        date_time_filter: 1,
        date_time_value1: new Date().toISOString(),
        date_time_value2: addHours(new Date(), next_x_hours).toISOString(),
        job_status_filter: 1,
        job_status_value: '[6]', // 0, 6, 7, 17
        aggrement_filter: 0,
        booking_status: 0,
        search_by_agreement_filter: 0,
        search_user_filter: 0,
        service_filter: 0,
        type_of_trip_filter: 0,
        vehicle_filter: 0,
    };

    const stringifiedSearchParams = Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key, String(value)])
    );

    let status: number;
    let data: any;

    try {
        const response = await getResponseFromURL(
            `${BOOKING_DETAIL_URL}?${new URLSearchParams({ ...stringifiedSearchParams, access_token: accessToken }).toString()}`
        );

        if (response === null) {
            console.error('Failed to fetch booking details: API response was null.');
            return null; // Exit early if the response is null, as per instruction
        }
        
        ({ status, data } = response);

    } catch (error) {
        console.error('Error fetching or processing booking details:', error);
        return null;
    }

    if (status !== 200) return null;

    const output = await Promise.all(
        data.result.map(async (booking: any) => {
            const vehicleDetail = await getVehicleDetail(booking.transport_details);
            return mapBookingToOutput(booking, vehicleDetail);
        })
    );

    return output.filter(Boolean);
} 