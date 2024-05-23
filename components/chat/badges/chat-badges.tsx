import { BookingInfoOutputProps, BranchProps, DriverProfileProps, VehicleDetailProps } from "@/lib/chat/types";
import { bookingStatus, paymentStatus } from "@/lib/transvip/config";
import { cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";

export function CityBadge({ branch, className }: { branch?: BranchProps, className?: string }) {
    return (
        <Badge variant={"default"} 
            className={cn("py-2 bg-slate-600 hover:bg-slate-700 text-xs text-white", className)}>
            {branch?.name}
        </Badge>
    )
}

export function BookingStatusBadge({ result } : { result : BookingInfoOutputProps }) {
    const bookingStatusLabel = bookingStatus.filter(bs => bs.status === result.booking.status).length ? 
    bookingStatus.filter(bs => bs.status === result.booking.status)[0].label : result.booking.status

    return (
        <Badge variant={"default"} 
            className={cn("h-9 py-2 text-white", 
            result.booking.status === 6 ? 'bg-red-600' :
            result.booking.status === 9 ? 'bg-orange-800' :
            result.booking.status === 2 ? 'bg-green-700' :
            result.booking.status === 12 ? 'bg-yellow-500' :
            'bg-black')}>
            { bookingStatusLabel }
        </Badge>
    )
}

export function PaymentStatusBadge({ result } : { result : BookingInfoOutputProps }) {
    const paymentStatusLabel = paymentStatus.filter(ps => ps.status === result.payment.status)[0].label

    return (
        <Badge variant={"default"} 
            className={cn("h-9 py-2 text-white", 
            result.payment.status === 0 ? 'bg-red-600' : 'bg-green-700')}>
            {paymentStatusLabel}
        </Badge>
    )
}

export function DriverStatusBadge({ result } : { result : DriverProfileProps }) {
    const driverStatus = result.status.current === 1 ? 'Online' : 'Offline'
    return (
        <Badge variant={"default"} 
            className={cn("py-2 text-white", 
            result.status.current === 1 ? 'bg-green-700 hover:bg-green-700' :
            result.status.current === 0 ? 'bg-red-400 hover:bg-red-400' :
            'bg-gray-800')}>
            { driverStatus }
        </Badge>
    )
}

export function VehicleStatusBadge({ result } : { result : VehicleDetailProps }) {
    const vehicleStatus = result.status === 1 ? 'Activo' : 'Inactivo'
    return (
        <Badge variant={"default"} 
            className={cn("py-2 text-white", 
            result.status === 1 ? 'bg-green-700 hover:bg-green-700' :
            result.status === 0 ? 'bg-red-400 hover:bg-red-400' :
            'bg-gray-800')}>
            { vehicleStatus }
        </Badge>
    )
}