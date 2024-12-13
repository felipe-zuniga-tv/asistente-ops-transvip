'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardFooter,
} from "@/components/ui/card"

interface QrScannerManualInputProps {
	onManualProcess: (input: string) => Promise<void>
	setIsManualMode: (isManual: boolean) => void
}

export function QrScannerManualInput({ onManualProcess, setIsManualMode }: QrScannerManualInputProps) {
	const [manualQRInput, setManualQRInput] = useState('')

	const handleNumberClick = (num: number) => {
		setManualQRInput(prev => `${prev}${num}`)
	}

	const handleProcess = async () => {
		await onManualProcess(manualQRInput)
		setManualQRInput('')
	}

	return (
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
					onClick={handleProcess}
				>
					Procesar
				</Button>
			</CardFooter>
		</Card>
	)
}