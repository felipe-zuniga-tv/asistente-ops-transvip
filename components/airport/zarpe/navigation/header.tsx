import React from 'react'
import { Menu, QrCode } from 'lucide-react'
import { TransvipLogo } from '@/components/transvip/transvip-logo'

interface HeaderProps {
	onMenuPress: () => void
	setActiveView: (view: string) => void
}

export function Header({ onMenuPress, setActiveView }: HeaderProps) {
	return (
		<div className="bg-orange-600 dark:bg-gray-800 p-6 flex justify-between items-center shadow-lg sticky top-0 z-10">
			<button
				onClick={onMenuPress}
				className="hidden text-white hover:bg-orange-700 dark:hover:bg-gray-700 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
				aria-label="Open menu"
			>
				<Menu className="w-8 h-8" />
			</button>
			<TransvipLogo colored={false} size={40} />
			<h1 className="text-white text-3xl font-bold">Aeropuerto Transvip</h1>
			<button
				onClick={() => setActiveView('qr')}
				className="text-white hover:bg-orange-700 dark:hover:bg-gray-700 p-2 rounded-full transition-all duration-300 transform hover:scale-110"
				aria-label="Open QR scanner"
			>
				<QrCode className="w-12 h-12" />
			</button>
		</div>
	)
}