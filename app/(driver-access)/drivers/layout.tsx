// import { getDriverSession } from "@/lib/auth"
// import { DriverHeader } from "@/components/driver/header"

export default async function DriverAccessLayout({
	children
}: {
	children: React.ReactNode
}) {
	// const session = await getDriverSession()

	return (
		<div className="min-h-screen bg-desert">
			<div className="max-w-4xl mx-auto p-3 md:px-0 py-6">
				{children}
			</div>
		</div>
	)
} 