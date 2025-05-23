"use client"

import { useState } from "react"
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from "@/components/ui/simple-dialog"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { createVehicleShift } from "@/lib/features/shifts/actions"
import { VehicleShift } from "./vehicle-shifts"
import { Input, Label } from "@/components/ui"
import { useToast } from "@/hooks/use-toast"

interface UploadVehicleShiftsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    shifts: {
        id: string
        name: string
        branch_id: string
    }[]
}

interface UploadSummary {
    total: number
    successful: number
    failed: number
    errors: string[]
}

export function UploadShiftsDialog({ open, onOpenChange, shifts }: UploadVehicleShiftsDialogProps) {
    const [progress, setProgress] = useState(0)
    const [summary, setSummary] = useState<UploadSummary | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const { toast } = useToast()

    const handleClose = () => {
        // Reset all states when closing
        setProgress(0)
        setSummary(null)
        setIsUploading(false)
        onOpenChange(false)
    }

    const validateShift = (row: any): row is VehicleShift => {
        return (
            typeof row.vehicle_number === "number" &&
            typeof row.branch_name === "string" &&
            typeof row.shift_name === "string" &&
            typeof row.start_date === "string" &&
            typeof row.end_date === "string" &&
            typeof row.priority === "number" &&
            row.priority >= 1 &&
            row.priority <= 100
        );
    };

    const processCSV = async (file: File) => {
        if (file.type !== "text/csv") {
            toast({
                title: "Error",
                description: "El archivo debe ser un CSV",
            })
            return
        }

        setIsUploading(true);
        setSummary(null);
        setProgress(0);

        const text = await file.text();
        const rows = text.split("\n").slice(1); // Skip header row
        const total = rows.length;
        const errors: string[] = [];
        let successful = 0;

        for (let i = 0; i < rows.length; i++) {
            try {
                const row = rows[i].split(",");
                const rawData = {
                    vehicle_number: parseInt(row[0]?.trim()),
                    branch_name: row[1]?.trim(),
                    shift_name: row[2]?.trim(),
                    start_date: row[3]?.trim(),
                    end_date: row[4]?.trim(),
                    priority: parseInt(row[5]?.trim()),
                };

                if (validateShift(rawData)) {
                    // Find the shift by name and branch
                    const shift = shifts.find(s => 
                        s.name.toLowerCase() === rawData.shift_name.toLowerCase()
                    );

                    if (!shift) {
                        errors.push(`Fila ${i + 2}: Turno "${rawData.shift_name}" no encontrado`);
                        continue;
                    }

                    await createVehicleShift({
                        vehicle_number: rawData.vehicle_number,
                        shift_id: shift.id,
                        start_date: new Date(rawData.start_date),
                        end_date: new Date(rawData.end_date),
                        priority: rawData.priority,
                    });
                    successful++;
                } else {
                    errors.push(`Fila ${i + 2}: Datos inválidos`);
                }
            } catch (error) {
                errors.push(`Fila ${i + 2}: ${error instanceof Error ? error.message : "Error desconocido"}`);
            }

            setProgress(((i + 1) / total) * 100);
        }

        setSummary({
            total,
            successful,
            failed: total - successful,
            errors,
        });
        setIsUploading(false);
    };

    return (
        <SimpleDialog isOpen={open} onClose={handleClose} className="min-w-[600px]">
            <SimpleDialogHeader>
                <SimpleDialogTitle>Carga Masiva de Turnos</SimpleDialogTitle>
            </SimpleDialogHeader>

            <div className="flex flex-col gap-4">
                <div className="text-sm flex flex-col gap-1 py-2">
                    <span>El archivo debe tener el siguiente formato:</span>
                    <div className="p-1.5 py-2.5 rounded-md shadow-md bg-gray-100 flex flex-row items-center justify-center">
                        <span className="font-semibold font-sans text-black ">Móvil, Sucursal, Nombre Turno, Fecha Inicio, Fecha Fin, Prioridad (1 a 100)</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Sube tu archivo CSV</Label>
                    <Input
                        type="file"
                        accept=".csv"
                        onChange={(e) => e.target.files?.[0] && processCSV(e.target.files[0])}
                        disabled={isUploading}
                        className="bg-gray-100 cursor-pointer p-1.5 file:me-2 file:border-0 file:border-e file:border-gray-300" 
                    />
                </div>

                {isUploading && (
                    <div className="space-y-2">
                        <Progress value={progress} />
                        <p className="text-sm text-muted-foreground">
                            Procesando... {Math.round(progress)}%
                        </p>
                    </div>
                )}

                {summary && (
                    <div className="p-3 bg-gray-100 rounded-md space-y-2">
                        <ul className="space-y-1">
                            <li className="flex flex-row gap-1 items-center">
                                <span className="text-sm font-bold">Total de filas:</span>
                                <span className="text-sm">{summary.total}</span>
                            </li>
                            <li className="flex flex-row gap-1 items-center text-green-600">
                                <span className="text-sm font-bold">Asignaciones creadas:</span>
                                <span className="text-sm">{summary.successful}</span>
                            </li>
                            <li className="flex flex-row gap-1 items-center text-red-600">
                                <span className="text-sm font-bold">Errores:</span>
                                <span className="text-sm">{summary.failed}</span>
                            </li>
                        </ul>
                        {summary.errors.length > 0 && (
                            <div className="max-h-32 overflow-y-auto text-sm text-red-600">
                                <ul className="list-disc list-inside">
                                    {summary.errors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cerrar
                    </Button>
                </div>
            </div>
        </SimpleDialog>
    )
}