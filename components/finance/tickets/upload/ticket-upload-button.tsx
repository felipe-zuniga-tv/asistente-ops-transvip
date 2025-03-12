import { Button } from "@/components/ui"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function UploadButton() {
	return (
		<Button variant="default" size={"default"} className="bg-transvip hover:bg-transvip/70" asChild>
			<Link href="/conductores/tickets/parking/upload">
			<PlusCircle className="h-4 w-4" />
			Subir Ticket
			</Link>
		</Button>
	)
}