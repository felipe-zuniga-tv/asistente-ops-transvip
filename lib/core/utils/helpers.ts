export function buildAPIUrl(endpoint: string | undefined) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl || !endpoint) {
        console.error('Missing required environment variables for API URL construction');
        return '';
    }
    // Remove any leading/trailing slashes to prevent double slashes
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return `${cleanBaseUrl}/${cleanEndpoint}`;
}

export function buildWhatsappLink(phone_number: string, text: string) {
    return encodeURI(`https://wa.me/${phone_number.replace('+', '').trim()}?text=${text.trim()}`)
}

export function formatChileanPeso(amount: number) {
    let chileanPeso = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    });
    return chileanPeso.format(amount);
}

export function buildGoogleMapsURL(originAddress: string, destinationAddress: string, waypoints?: string[]) {
    const BASE_GOOGLE_MAPS_URL = 'https://www.google.com/maps/dir/';
    const params = [
        `api=1`,
        `travelmode=driving`,
        `origin=${encodeURIComponent(originAddress)}`,
        `destination=${encodeURIComponent(destinationAddress)}`,
    ]
    
    if (waypoints && waypoints.length > 0) {
        params.push(`waypoints=${waypoints.join("|")}`)
    }
    return `${BASE_GOOGLE_MAPS_URL}?${params.join("&")}`
}

export async function getResponseFromURL(URL: string) {
    try {
        const options = {
            method: 'GET',
            headers: {
                'content-language': 'es'
            }
        };
        const response = await fetch(URL, options);
        const output = await response.json();
        return output;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function postJSONRequest(URL: string, data: Record<string, any>) {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'content-language': 'es'
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(URL, options)
        const output = await response.json()
        return output;
    } catch (e) {
        console.error(e)
        return null;
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