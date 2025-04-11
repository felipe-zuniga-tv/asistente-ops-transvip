import { Button } from "@/components/ui/button";
import { buildGoogleMapsURL } from "@/lib/services/utils/helpers";
import { IBookingInfoOutput } from "@/lib/core/types/chat";
import { cn } from '@/utils/ui';
import { MapIcon } from "lucide-react";

export default function GoogleMapsButton({ result, text, className = "" } : {
    result : IBookingInfoOutput[]
    text?: string
    className?: string
}) {
    // Get origin from first booking
    const origin = result[0].directions.origin.address
    
    // Get destination from last booking
    const destination = result[result.length - 1].directions.destination.address

    // Get waypoints
    let waypoints = result.length === 2 
        ? result[1].booking.type_of_trip === 'P' || result[1].booking.type_of_trip === 'R' ? [result[1].directions.origin.address] : [result[1].directions.destination.address]
        : result[1].booking.type_of_trip === 'P' || result[1].booking.type_of_trip === 'R' ? result.slice(1, -1).map(r => r.directions.origin.address) : result.slice(1, -1).map(r => r.directions.destination.address)

    if (result.length > 2) {
        waypoints.push(result.slice(-1).map(r => r.directions.origin.address)[0])
    }

    // Generate Google Maps URL with all stops
    const googleMapsUrl = buildGoogleMapsURL(origin, destination, waypoints)

    return (
        <Button variant="default" className={cn("mt-2 px-6 py-0.5 bg-green-600 hover:bg-green-800 w-fit", className)}
            onClick={() => window.open(googleMapsUrl, '_blank')}>
            { text || 'Ver ruta' }
            <MapIcon className='h-4 w-4 ml-2' />
        </Button>
    )
}