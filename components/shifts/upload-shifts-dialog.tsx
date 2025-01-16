"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { createShift } from "@/lib/database/actions";
import { Shift } from "./shifts-content";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface UploadShiftsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface UploadSummary {
    total: number;
    successful: number;
    failed: number;
    errors: string[];
}

export function UploadShiftsDialog({ open, onOpenChange }: UploadShiftsDialogProps) {
    const [progress, setProgress] = useState(0);
    const [summary, setSummary] = useState<UploadSummary | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset all states when closing
            setProgress(0);
            setSummary(null);
            setIsUploading(false);
        }
        onOpenChange(newOpen);
    };

    const validateShift = (row: any): row is Shift => {
        return (
            typeof row.name === "string" &&
            typeof row.start_time === "string" &&
            typeof row.end_time === "string" &&
            typeof row.free_day === "number" &&
            row.free_day >= 1 &&
            row.free_day <= 7
        );
    };

    const processCSV = async (file: File) => {
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
                const shiftData = {
                    name: row[0]?.trim(),
                    start_time: row[1]?.trim(),
                    end_time: row[2]?.trim(),
                    free_day: parseInt(row[3]?.trim()),
                };

                if (validateShift(shiftData)) {
                    await createShift(shiftData);
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
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Carga Masiva de Turnos</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="text-sm flex flex-col gap-1 py-2">
                        <span>El archivo debe tener el siguiente formato:</span>
                        <span className="font-bold text-gray-500">Nombre, Hora de Inicio, Hora de Fin, Día Libre (1 a 7)</span>
                    </div>
                    <div className="space-y-2">
                        <Label>Sube tu archivo CSV</Label>
                        <Input
                            type="file"
                            accept=".csv"
                            onChange={(e) => e.target.files?.[0] && processCSV(e.target.files[0])}
                            disabled={isUploading}
                            className="bg-orange-100 cursor-pointer p-1.5 file:me-2 file:border-0 file:border-e file:border-gray-300" 
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
                                    <span className="text-sm font-bold">Turnos creados:</span>
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
                            onClick={() => handleOpenChange(false)}
                            disabled={isUploading}
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}