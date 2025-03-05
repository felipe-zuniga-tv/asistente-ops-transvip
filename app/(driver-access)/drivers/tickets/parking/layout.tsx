// import { getDriverSession } from "@/lib/auth"
// import { DriverHeader } from "@/components/driver/header"

export default async function ParkingTicketsLayout({
	children
}: {
	children: React.ReactNode
}) {
	// const session = await getDriverSession()

	return (
        <div className="p-6 bg-white rounded-lg">
            {children}
        </div>
	)
} 