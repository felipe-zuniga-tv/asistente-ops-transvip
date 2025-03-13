import { DriverNavbar } from "@/components/drivers-portal/driver-navbar"

export default async function DriverAccessLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="bg-blue-50_ bg-santiago bg-cover bg-center min-h-screen flex flex-col">
			<DriverNavbar />
			<div className="flex-1 flex flex-col items-center justify-start p-4">
				{children}
			</div>
		</div>
	)
} 