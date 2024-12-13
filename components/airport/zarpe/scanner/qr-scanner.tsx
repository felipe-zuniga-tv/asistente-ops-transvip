'use client'

import { useState } from 'react'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { Camera, QrCodeIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card"

interface QrScannerProps {
	onScan: (data: string) => Promise<void>
	isScanning?: boolean
}

export function QrScanner({ onScan, isScanning }: QrScannerProps) {
	const [error, setError] = useState<string | null>(null)
	const [manualQRInput, setManualQRInput] = useState('')
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

	const handleNumberClick = (num: number) => {
		setManualQRInput(prev => `${prev}${num}`)
	}

	const handleManualProcess = async () => {
		if (!manualQRInput) return
		try {
			await onScan(manualQRInput)
			setManualQRInput('')
			setError(null)
		} catch (err) {
			setError('Error al procesar el código')
			console.error(err)
		}
	}

	if (!isScannerActive) {
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

	return (
		<div className="flex-1 flex flex-col items-center pt-8">
			{error && <p className="text-sm text-red-500 mb-2">{error}</p>}
			
			<div className="w-full max-w-md">
				{!isManualMode ? (
					<div className="space-y-4">
						<div className="relative aspect-square rounded-lg">
							{!isScanning && 
								<Scanner
									onScan={handleScan}
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
				) : (
					<Card>
						<CardContent className="flex flex-col gap-4 items-center p-6">
							<Input
								value={manualQRInput}
								onChange={(e) => setManualQRInput(e.target.value)}
								placeholder="Número de Reserva"
								className="text-2xl h-16 text-center mb-4 bg-gray-50 dark:bg-gray-700 dark:text-white"
							/>
							<div className="grid grid-cols-3 gap-2 w-full">
								{[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
									<Button
										key={num}
										className="text-2xl h-12 dark:bg-gray-700 dark:text-white"
										onClick={() => handleNumberClick(num)}
									>
										{num}
									</Button>
								))}
								<Button
									className="text-xl h-12 col-span-2 dark:bg-gray-700 dark:text-white"
									onClick={() => setManualQRInput('')}
								>
									Borrar
								</Button>
							</div>
						</CardContent>
						<CardFooter className="flex gap-2">
							<Button 
								variant="outline"
								className="flex-1"
								onClick={() => setIsManualMode(false)}
							>
								<Camera /> Usar cámara
							</Button>
							<Button 
								className="flex-1 dark:bg-orange-600 dark:text-white" 
								onClick={handleManualProcess}
							>
								Procesar
							</Button>
						</CardFooter>
					</Card>
				)}
			</div>
		</div>
	)
}