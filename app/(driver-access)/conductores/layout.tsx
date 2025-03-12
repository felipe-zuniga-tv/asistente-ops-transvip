import { DriverNavbar } from "@/components/drivers-portal/driver-navbar"

export default async function DriverAccessLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="h-screen bg-desert flex flex-col">
			<DriverNavbar />
			<div className="flex-1 flex flex-col items-center justify-start p-4">
				{children}
			</div>
		</div>
	)
} 