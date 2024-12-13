'use client'

import React, { useState } from 'react'
import { QrCode } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { toast } from "@/components/ui/use-toast"

interface QRScannerProps {
  manualQRInput: string
  setManualQRInput: React.Dispatch<React.SetStateAction<string>>
}

export default function QRScanner({ manualQRInput, setManualQRInput }: QRScannerProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualQRInput(e.target.value)
  }

  const handleNumberClick = (num: number) => {
    setManualQRInput(prev => `${prev}${num}`)
  }

  const handleClear = () => {
    setManualQRInput('')
  }

  const handleProcess = () => {
    
    setManualQRInput('')
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-3xl m-4 shadow-lg">
      <div className="relative mb-6">
        <QrCode className="w-64 h-64 text-orange-600 dark:text-orange-400 animate-pulse" />
        <div className="absolute inset-0 bg-orange-600 dark:bg-orange-400 opacity-20 animate-ping rounded-3xl"></div>
      </div>
      <p className="mt-6 text-xl text-gray-800 dark:text-gray-200 font-semibold mb-4">Escanea el código QR de la reserva</p>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">O ingresa el código manualmente:</p>
      <div className="w-full max-w-xs">
        <Input
          value={manualQRInput}
          onChange={handleInputChange}
          placeholder="Código QR"
          className="text-2xl h-16 text-center mb-4 dark:bg-gray-700 dark:text-white"
        />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <Button
              key={num}
              className="text-3xl h-16 dark:bg-gray-700 dark:text-white"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            className="text-3xl h-16 col-span-2 dark:bg-gray-700 dark:text-white"
            onClick={handleClear}
          >
            Borrar
          </Button>
        </div>
        <Button className="w-full mt-4 text-lg dark:bg-orange-600 dark:text-white" onClick={handleProcess}>
          Procesar código QR
        </Button>
      </div>
    </div>
  )
}