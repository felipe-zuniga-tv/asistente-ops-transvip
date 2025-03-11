import { getDriverSession } from "@/lib/driver/auth"
import { redirect } from "next/navigation"
import { TicketUploadForm } from "@/components/finance/tickets/upload/ticket-upload-form"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function UploadTicketPage() {
    const session = await getDriverSession()
    if (!session) {
        redirect('/conductores/login')
    }

    return (
        <div className="flex flex-col gap-6 bg-white rounded-lg p-6">
            <div className="flex flex-col items-start gap-2">
                <div className="w-full flex justify-start items-center gap-2">
                    <TransvipLogo size={24} />
                    <span className="text-lg font-bold">Subir Ticket de Estacionamiento</span>
                </div>

                <Button variant="outline" size="sm" className="gap-1" asChild>
                    <Link href="/conductores/tickets/parking/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        Todos los tickets
                    </Link>
                </Button>
                
            </div>
            <TicketUploadForm driverId={session.driver_id} />
        </div>
    )
} 