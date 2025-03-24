import Link from "next/link"
import { redirect } from "next/navigation"
import { getDriverSession } from "@/lib/driver/auth"
import { TicketUploadForm } from "@/components/finance/tickets/upload/ticket-upload-form"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { Button } from "@/components/ui"
import { ArrowLeft } from "lucide-react"

export default async function UploadTicketPage() {
    const session = await getDriverSession()
    if (!session) {
        redirect('/conductores')
    }

    return (
        <div className="flex flex-col gap-6 bg-white rounded-lg p-6 w-full max-w-3xl shadow-md">
            <div className="flex flex-col items-start gap-2">
                <div className="w-full flex justify-start items-center gap-2">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/conductores/tickets/parking/dashboard">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <span className="text-base md:text-lg font-bold">Subir Ticket de Estacionamiento</span>
                    <TransvipLogo size={24} className="ml-auto" />
                </div>
            </div>
            <TicketUploadForm driverId={session.driver_id} vehicleNumber={session.vehicle_number} />
        </div>
    )
} 