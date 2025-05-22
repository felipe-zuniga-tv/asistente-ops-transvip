import React from "react"

export default function SalesLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative h-screen">
			<div className="absolute inset-0 bg-main bg-cover bg-left opacity-40" />
			<div className="relative z-10">
				<div className="max-w-2xl mx-auto p-4 sm:p-10">
					{children}
				</div>
			</div>
		</div>
	);
}