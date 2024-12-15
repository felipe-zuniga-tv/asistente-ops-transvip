'use client'

import { useState } from 'react'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { Button } from "@/components/ui/button"

interface QrScannerViewProps {
	onScan: (results: IDetectedBarcode[]) => Promise<void>
	setIsManualMode: (isManual: boolean) => void
	isScanning: boolean
}

export function QrScannerView({ onScan, setIsManualMode, isScanning }: QrScannerViewProps) {
	const [error, setError] = useState<string | null>(null)

	return (
		<div className="space-y-4">
			<div className="relative aspect-square rounded-lg">
				{!isScanning &&
					<Scanner
						onScan={onScan}
						onError={() => setError('Error accessing camera')}
						scanDelay={500}
					/>
				}
				{isScanning && (
					<div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
						<div className="text-white">Procesando...</div>
					</div>
				)}
			</div>
			<div className="flex justify-center">
				<Button
					variant="outline"
					onClick={() => setIsManualMode(true)}
				>
					Entrada manual
				</Button>
			</div>
		</div>
	)
}