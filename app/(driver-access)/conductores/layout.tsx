export default async function DriverAccessLayout({ children }: {
	children: React.ReactNode
}) {
	return (
		<div className="min-h-screen bg-desert p-4">
			<div className="max-w-5xl mx-auto">
				{children}
			</div>
		</div>
	)
} 