'use client'
import { Button } from "@/components/ui/button";
import { BookingInfoOutputProps } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

export function BookingIdBadge({ result, handleClick }: { 
    result : BookingInfoOutputProps
    handleClick: any
}) {
    return (
        <Button variant={"default"}
            onClick={() => handleClick(result, 'booking')}
            className={cn("h-min py-1 md:py-2 text-white w-fit bg-transvip/80 hover:bg-transvip-dark text-sm", "")}>
            { result.booking.id }
        </Button>
    )
}