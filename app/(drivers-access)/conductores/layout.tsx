import { DriverNavbar } from "@/components/drivers-portal/driver-navbar"

export default async function DriverAccessLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="bg-blue-50_ bg-santiago bg-cover bg-center min-h-screen flex flex-col">
			<DriverNavbar />
			{children}
		</div>
	)
} 