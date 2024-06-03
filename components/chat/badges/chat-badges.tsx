import { BookingInfoOutputProps, BranchProps, DriverProfileProps, VehicleDetailProps } from "@/lib/chat/types";
import { bookingStatus, driverStatus, getBookingStatusColor, getPaymentStatusColor, paymentStatus, vehicleStatus } from "@/lib/transvip/config";
import { cn } from "@/lib/utils";
import { Badge } from "../../ui/badge";
import PaymentAvatar from "../payment/payment-avatar";
import { differenceInDays } from "date-fns";

export function CityBadge({ branch, className }: { branch?: BranchProps, className?: string }) {
    return (
        <Badge variant={"default"} 
            className={cn("py-1 md:py-2 bg-slate-600 hover:bg-slate-700 text-xs text-white cursor-pointer", className)}>
            {branch?.name}
        </Badge>
    )
}

export function BookingStatusBadge({ result } : { result : BookingInfoOutputProps }) {
    const bookingStatusItem = bookingStatus.filter(bs => bs.status === result.booking.status)[0]
    const bookingStatusLabel = bookingStatusItem ? bookingStatusItem.label : result.booking.status
    const bookingStatusColorValue = getBookingStatusColor(result.booking.status)

    return (
        <Badge variant={"default"} 
            className={cn("py-1 md:py-2 text-white cursor-pointer", bookingStatusColorValue)}>
            { bookingStatusLabel }
        </Badge>
    )
}

export function CustomerVipBadge({ result } : { result : BookingInfoOutputProps }) {
    const vipFlagLabel = result.customer.vip_flag ? 'VIP' : 'NO VIP'
    const vipFlagColor = result.customer.vip_flag ? 'bg-orange-200' : 'bg-gray-200'
    return (
        <Badge variant={'outline'} className={vipFlagColor}>
            { vipFlagLabel }
        </Badge>
    )
}

export function PaymentStatusBadge({ result } : { result : BookingInfoOutputProps }) {
    const paymentStatusItem = paymentStatus.filter(ps => ps.status === result.payment.status)[0]
    const paymentStatusLabel = paymentStatusItem ? paymentStatusItem.label : result.payment.status
    const paymentStatusColor = getPaymentStatusColor(result.payment.status)

    return (
        <Badge variant={"default"} 
            className={cn("py-1 md:py-2 text-white flex flex-row gap-2 items-center cursor-pointer", paymentStatusColor)}>
            <span>{ paymentStatusLabel }</span>
            <PaymentAvatar result={result} />
        </Badge>
    )
}

export function DriverStatusBadge({ result } : { result : DriverProfileProps }) {
    const driverStatusLabel = driverStatus.filter(ds => ds.status === result.status.current)[0].label
    return (
        <Badge variant={"default"} 
            className={cn("py-1 md:py-2 text-white", 
            result.status.current === 1 ? 'bg-green-700 hover:bg-green-700' :
            result.status.current === 0 ? 'bg-red-400 hover:bg-red-400' :
            'bg-gray-800')}>
            { driverStatusLabel }
        </Badge>
    )
}

export function VehicleStatusBadge({ result } : { result : VehicleDetailProps }) {
    const vehicleStatusItem = vehicleStatus.filter(vs => vs.status === result.status)[0]
    const vehicleStatusLabel = vehicleStatusItem.label
    const vehicleStatusColor = vehicleStatusItem.color
    return (
        <Badge variant={"default"} 
            className={cn("py-1 md:py-2 text-white", vehicleStatusColor
            // result.status === 1 ? 'bg-green-700 hover:bg-green-700' :
            // result.status === 0 ? 'bg-red-400 hover:bg-red-400' :
            // 'bg-gray-800'
            )}>
            { vehicleStatusLabel }
        </Badge>
    )
}

export function LicenseExpirationBadge({ result } : { result : DriverProfileProps }) {
    let days_to_expiration_license = null
    if (result.driver_documents.license.expiration_date) {
        const _aux_license_expiration_date = result.driver_documents.license.expiration_date?.substring(0, result.driver_documents.license.expiration_date.indexOf("T")) as string
        const license_expiration_date = new Date(_aux_license_expiration_date)
        days_to_expiration_license = differenceInDays(license_expiration_date, new Date())
    }

    if (!result.driver_documents.license.expiration_date) return null

    return (
        <>
            <Badge variant={'default'} 
                className={cn(
                    "bg-gray-200 text-white",
                    `${days_to_expiration_license && days_to_expiration_license < 0 ? 'bg-red-400 hover:bg-red-500' : 'bg-green-700 hover:bg-green-700'}`
                )}
            >
                { result.driver_documents.license.expiration_date?.substring(0, result.driver_documents.license.expiration_date.indexOf("T")) }
            </Badge>
            { days_to_expiration_license && days_to_expiration_license > 0 && <span className='hidden md:block'>(faltan {days_to_expiration_license} días)</span>}
            { days_to_expiration_license && days_to_expiration_license < 0 && <span className='hidden md:block'>(vencido hace {-1*days_to_expiration_license} días)</span>}
        </>
    )
}