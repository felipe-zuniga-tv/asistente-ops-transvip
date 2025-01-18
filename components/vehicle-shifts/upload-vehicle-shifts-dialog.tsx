"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Download } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { generateVehicleShiftsTemplate, VEHICLE_SHIFTS_CSV_HEADERS } from '@/lib/csv/vehicle-shifts-template'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { uploadVehicleShifts } from "@/lib/shifts/actions"

interface UploadError {
    row: number
    message: string
}

interface UploadShiftsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    shifts: {
        id: string
        name: string
    }[]
}

export function UploadShiftsDialog({
    open,
    onOpenChange,
    shifts,
}: UploadShiftsDialogProps) {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const [errors, setErrors] = useState<UploadError[]>([])

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsUploading(true)
        setErrors([])

        try {
            const csvContent = await file.text()
            const result = await uploadVehicleShifts(csvContent, shifts)

            if (result.error) {
                setErrors([{ row: 0, message: result.error }])
                return
            }

            if (result.errors) {
                setErrors(result.errors)
                return
            }

            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error("Error:", error)
            setErrors([{ row: 0, message: "Error al cargar el archivo" }])
        } finally {
            setIsUploading(false)
        }
    }, [onOpenChange, router, shifts])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
        },
        maxFiles: 1,
        disabled: isUploading,
    })

    const handleDownloadTemplate = () => {
        const template = generateVehicleShiftsTemplate()
        const blob = new Blob([template], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "plantilla-asignaciones.csv"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Carga Masiva de Asignaciones</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleDownloadTemplate}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Plantilla CSV
                    </Button>

                    <div
                        {...getRootProps()}
                        className={`
                            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                            transition-colors duration-200
                            ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
                            ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                    >
                        <input {...getInputProps()} />
                        <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            {isDragActive
                                ? "Suelte el archivo aquí"
                                : "Arrastre un archivo CSV o haga clic para seleccionar"}
                        </p>
                        {isUploading && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Procesando archivo...
                            </p>
                        )}
                    </div>

                    {errors.length > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                <ScrollArea className="h-[100px] w-full rounded-md">
                                    <ul className="space-y-1">
                                        {errors.map((error, index) => (
                                            <li key={index} className="text-sm">
                                                {error.row > 0
                                                    ? `Fila ${error.row}: ${error.message}`
                                                    : error.message}
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="text-xs text-muted-foreground">
                        <p>El archivo CSV debe contener las siguientes columnas:</p>
                        <p className="font-mono mt-1">
                            {VEHICLE_SHIFTS_CSV_HEADERS.join(", ")}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
