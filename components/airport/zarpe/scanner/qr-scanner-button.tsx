'use client'

import { QrCodeIcon } from 'lucide-react'
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card"

interface QrScannerButtonProps {
	setIsScannerActive: (isActive: boolean) => void
}

export function QrScannerButton({ setIsScannerActive }: QrScannerButtonProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px]">
			<Card
				className="cursor-pointer text-center flex flex-col items-center"
				onClick={() => setIsScannerActive(true)}
				role="button"
				tabIndex={0}
				title="Click to activate camera scanner"
			>
				<CardContent className='p-6'>
					<QrCodeIcon className="w-64 h-64 text-orange-600 dark:text-orange-400" />
				</CardContent>
				<CardFooter>
					<p className="text-lg font-medium">Click para escanear QR</p>
				</CardFooter>
			</Card>
		</div>
	)
}