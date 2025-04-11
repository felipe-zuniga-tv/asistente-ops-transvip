import { cn } from '@/utils/ui';
import Image from "next/image";

interface TransvipLogoProps {
    logoOnly?: boolean;
    colored?: boolean;
    size?: number;
    className?: string;
}

export function TransvipLogo({ 
    logoOnly = true, 
    colored = true, 
    size = 32, 
    className = "" 
}: TransvipLogoProps): JSX.Element {
    return (
        logoOnly ? 
            <Image
                src={colored ? "/images/transvip-logo-only-color.png" : "/images/transvip-logo-only-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
                priority={true}
            /> :
            <Image
                src={colored ? "/images/transvip-logo-color.png" : "/images/transvip-logo-bnw.png"} 
                width={size}
                height={size}
                className={cn("object-fit h-auto", className)}
                alt="Transvip Logo" 
                priority={true}
            />
    );
}