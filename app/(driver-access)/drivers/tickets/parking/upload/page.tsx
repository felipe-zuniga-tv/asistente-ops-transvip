import { getDriverSession } from "@/lib/driver/auth"
import { redirect } from "next/navigation"
import { TicketUploadForm } from "@/components/finance/tickets/upload/ticket-upload-form"
import { TransvipLogo } from "@/components/transvip/transvip-logo"
export default async function UploadTicketPage() {
    const session = await getDriverSession()
    if (!session) {
        redirect('/drivers/login')
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <TransvipLogo size={24} />
                <h1 className="text-xl font-bold">Subir Ticket de Estacionamiento</h1>
            </div>
            <TicketUploadForm driverId={session.driver_id} />
        </div>
    )
} 