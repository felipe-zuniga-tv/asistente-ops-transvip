import { Routes } from "@/utils/routes";
import Link from 'next/link'
import { TransvipLogo } from "@/components/transvip/transvip-logo";

export default function QRCodeGeneratorLink() {
    return (
        <Link href={Routes.QR_GEN} className="w-full">
            <div className="border p-2 bg-white hover:bg-gray-200/50 hover:cursor-pointer rounded-md shadow-md w-full flex items-center justify-start gap-3 text-muted-background">
                <TransvipLogo logoOnly={true} colored={false} size={20} className="bg-transvip p-1 rounded-md" />
                <div className="grid gap-0.5">
                    <span>Generar QR</span>
                    <p className="text-xs text-muted-foreground" data-description>Ingresa el número de reserva</p>
                </div>
            </div>
        </Link>
    )
}