'use client'
import { Button } from "@/components/ui/button";
import { BookingInfoOutputProps } from "@/lib/chat/types";
import { cn } from "@/lib/utils";

export function BookingIdBadge({ result, handleClick, className }: { 
    result : BookingInfoOutputProps
    handleClick: any
    className?: string
}) {
    return (
        <Button variant={"default"}
            onClick={() => handleClick(result, 'booking')}
            className={cn("h-min py-1 md:py-2 text-white w-fit_ w-[90px] bg-transvip/80 hover:bg-transvip-dark text-sm", className as string)}>
            { result.booking.id }
        </Button>
    )
}