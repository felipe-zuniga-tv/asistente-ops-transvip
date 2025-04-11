import { DriverNavbar } from "@/components/features/drivers/driver-navbar"

export default async function DriverAccessLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="bg-santiago bg-cover bg-center min-h-screen flex flex-col">
			<DriverNavbar />
			{children}
		</div>
	)
} 