'use client'

import { useState } from 'react'
import { IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { QrScannerButton } from './qr-scanner-button'
import { QrScannerView } from './qr-scanner-view'
import { QrScannerManualInput } from './qr-scanner-manual-input'

interface QrScannerProps {
	onScan: (data: string) => Promise<void>
	isScanning?: boolean
}

export function QrScanner({ onScan, isScanning }: QrScannerProps) {
	const [error, setError] = useState<string | null>(null)
	const [isScannerActive, setIsScannerActive] = useState(false)
	const [isManualMode, setIsManualMode] = useState(false)

	const handleScan = async (results: IDetectedBarcode[]) => {
		if (!results?.length) return

		try {
			await onScan(results[0].rawValue)
			setError(null)
		} catch (err) {
			setError('Error al procesar el código QR')
			console.error(err)
		}
	}

	const handleManualProcess = async (input: string) => {
		if (!input) return
		try {
			await onScan(input)
			setError(null)
		} catch (err) {
			setError('Error al procesar el código')
			console.error(err)
		}
	}

	if (!isScannerActive) {
		return <QrScannerButton setIsScannerActive={setIsScannerActive} />
	}

	return (
		<div className="flex-1 flex flex-col items-center pt-8">
			{error && <p className="text-sm text-red-500 mb-2">{error}</p>}

			<div className="w-full max-w-md">
				{!isManualMode ? (
					<QrScannerView onScan={handleScan} setIsManualMode={setIsManualMode} isScanning={isScanning ?? false} />
				) : (
					<QrScannerManualInput onManualProcess={handleManualProcess} setIsManualMode={setIsManualMode} />
				)}
			</div>
		</div>
	)
}