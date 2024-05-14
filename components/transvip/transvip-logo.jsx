import { cn } from "@/lib/utils";
import Image from "next/image";

export function TransvipLogo({ logoOnly = false, colored = true, size = 40, className = "" }) {
    return (
        logoOnly ? 
            <Image
                src={"/images/transvip-logo-only-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
            /> :
            <Image
                src={colored ? "/images/transvip-logo.jpeg" : "/images/transvip-logo-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
            />
    )
}