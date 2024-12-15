// import React from 'react'
import { Car, Users, Clock, Map, Lightbulb } from 'lucide-react'

interface NavigationProps {
	activeView: string
	setActiveView: (view: string) => void
	passengerCount: {
		shared: number
		lowFrequency: number
	}
}

export function Navigation({ activeView, setActiveView, passengerCount }: NavigationProps) {
	const navItems = [
		{ icon: Car, label: 'Móviles', view: 'vehicles' },
		{ icon: Users, label: 'Compartidos', view: 'shared', count: passengerCount.shared },
		{ icon: Clock, label: 'Baja frec.', view: 'lowFrequency', count: passengerCount.lowFrequency },
		{ icon: Map, label: 'Rutas', view: 'routes' },
		{ icon: Lightbulb, label: 'Zona Iluminada', view: 'alerts' },
	]

	return (
		<nav className="flex justify-around bg-white dark:bg-gray-800 p-4 shadow-lg relative z-10">
			{navItems.map(({ icon: Icon, label, view, count }) => (
				<button
					key={view}
					onClick={() => setActiveView(view)}
					className={`flex flex-col items-center transition-all duration-300 transform ${activeView === view
							? 'text-orange-600 dark:text-orange-400 scale-110'
							: 'text-gray-400 dark:text-gray-500 hover:text-orange-400 dark:hover:text-orange-300'
						}`}
				>
					<div className="relative">
						<Icon className="w-8 h-8" />
						{count !== undefined && (
							<span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
								{count}
							</span>
						)}
					</div>
					<span className="mt-1 text-xs">{label}</span>
				</button>
			))}
		</nav>
	)
}