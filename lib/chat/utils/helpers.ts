export function buildAPIUrl(endpoint: string | undefined) {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`
}

export function buildWhatsappLink(phone_number : string, text: string) {
    return encodeURI(`https://wa.me/${phone_number.replace('+', '').trim()}?text=${text.trim()}`)
}

export function buildGoogleMapsURL(originAddress: string, destinationAddress: string, waypoints?: string[]) {
    const BASE_GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir/'

    const params = [
        `api=1`,
        `travelmode=driving`,
        `origin=${encodeURIComponent(originAddress)}`,
        `destination=${encodeURIComponent(destinationAddress)}`,
    ]
    
    const waypointsList = waypoints?.join("|")
    // Check for waypoints
    if (waypoints && waypoints?.length > 0) {
        params.push(`waypoints=${waypointsList}`)
    }

    // URL Params
    const paramsURL = params.join("&")
    const googleMapsUrl = `${BASE_GOOGLE_MAPS_URL}?${paramsURL}`

    return googleMapsUrl
}

export async function getResponseFromURL(URL: string) {
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

export function cleanDriverInfo(d: any) {
    return {
        country_code: d.country_code.trim(),
        phone: d.phone.trim(),
        first_name: d.first_name.trim(),
        last_name: d.last_name.trim(),
        fleet_id: d.fleet_id,
    }
}

export function getAssignedVehicles(c: any) {
    return {
        active: c.status === 1,
        license_plate: c.car_number,
        vehicle_type_name: c.car_name,
        vehicle_number: parseInt(c.unique_car_id),
    }
} 