import { cn } from '@/lib/utils/ui';
import Image from "next/image";

export function TransvipLogo({ logoOnly = true, colored = true, size = 40, className = "" }) {
    return (
        logoOnly ? 
            <Image
                src={colored ? "/images/transvip-logo-only-color.png" : "/images/transvip-logo-only-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
            /> :
            <Image
                src={colored ? "/images/transvip-logo-only-color.png" : "/images/transvip-logo-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
            />
    )
}