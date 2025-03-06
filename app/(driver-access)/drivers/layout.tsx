// import { getDriverSession } from "@/lib/auth"
// import { DriverHeader } from "@/components/driver/header"

export default async function DriverAccessLayout({
	children
}: {
	children: React.ReactNode
}) {
	// const session = await getDriverSession()

	return (
		<div className="min-h-screen bg-desert p-4">
			<div className="max-w-4xl mx-auto">
				{children}
			</div>
		</div>
	)
} 