'use client'
import { Button } from "@/components/ui/button";
import { IBookingInfoOutput } from "@/lib/core/types/chat";
import { cn } from "@/lib/utils";

export function BookingIdBadge({ result, handleClick, className }: { 
    result : IBookingInfoOutput
    handleClick: any
    className?: string
}) {
    if (!handleClick) {
        return (
            <Button variant={"default"}
                className={cn("h-min py-1 text-white w-[90px] bg-transvip/80 hover:bg-transvip-dark text-sm", className || "")}>
                { result.booking.id }
            </Button>
        )
    }
    
    return (
        <Button variant={"default"}
            onClick={() => handleClick(result, 'booking')}
            className={cn("h-min py-1 text-white w-[90px] bg-transvip/80 hover:bg-transvip-dark text-sm", className || "")}>
            { result.booking.id }
        </Button>
    )
}