"use client";

import { useEffect, useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ShiftDialog } from "./shift-dialog";
import { deleteShift } from "@/lib/features/vehicle-shifts";
import { UploadShiftsDialog } from "./upload-shifts-dialog";
import { ShiftsDataTable } from "./table/shifts-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteShift } from "./delete-shift-alert-dialog";
import { toast } from "sonner";
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container";
import { downloadFile } from "@/utils/file";
import type { Shift } from "@/types/domain/shifts/types";
import { ColumnDef } from "@tanstack/react-table";

export const WEEKDAYS = [
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
    { value: "6", label: "Sábado" },
    { value: "7", label: "Domingo" },
];

interface ShiftsCardProps {
    shifts: Shift[];
}

export function ShiftsDefinition({ shifts }: ShiftsCardProps) {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [editingShift, setEditingShift] = useState<Shift | null>(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

    useEffect(() => {
        if (!isDialogOpen) {
            // Reset pointer-events when dialog closes
            document.body.style.pointerEvents = "";
        }
        return () => {
            // Cleanup
            document.body.style.pointerEvents = "auto";
        };
    }, [isDialogOpen]);

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift);
        // Set dialog open after setting the shift
        setTimeout(() => {
            setIsDialogOpen(true);
        }, 0);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setEditingShift(null);
    };

    const handleDeleteShift = async (shift: Shift) => {
        try {
            await deleteShift(shift.id);
            router.refresh();
            toast.success("Turno eliminado exitosamente");
        } catch (error) {
            console.error('Error deleting shift:', error);
            toast.error("Error al eliminar el turno");
        }
    };

    const generateShiftsTemplate = () => {
        const headers = ["Sucursal", "Nombre", "Hora Inicio", "Hora Fin", "Día Libre", "Anexo 2"]
        const example = ["Santiago", "Turno AM", "08:00", "16:00", "1", "True"]
        return [headers.join(","), example.join(",")].join("\n")
    }

    const handleDownloadTemplate = async () => {
        const template = generateShiftsTemplate()
        await downloadFile(template, "plantilla-turnos.csv", {
            onError: () => {
                toast.error("No se pudo descargar el archivo")
            }
        })
    }

    return (
        <ConfigCardContainer title="Jornadas de Conexión"
            onAdd={() => setIsDialogOpen(true)}
            className="max-w-full"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Switch checked={showFilters} onCheckedChange={setShowFilters} />
                    <Label>{showFilters ? "Ocultar" : "Mostrar"} Filtros</Label>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadTemplate}
                    >
                        <Download className="w-4 h-4" />
                        Plantilla CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsUploadDialogOpen(true)}
                    >
                        <Upload className="w-4 h-4" />
                        Carga Masiva
                    </Button>
                </div>
            </div>

            {showFilters && (
                <div className="mb-4 space-y-4 p-4 border rounded-md">
                    <div className="flex items-center justify-start gap-6">
                        <Label>Días libres</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDays([1, 2, 3, 4, 5, 6, 7])}
                        >
                            Seleccionar todos
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {WEEKDAYS.map((weekday) => (
                            <div key={weekday.value} className="flex items-center space-x-2 border rounded-md p-2 w-fit">
                                <Checkbox
                                    id={`day-${weekday.value}`}
                                    checked={selectedDays.includes(Number(weekday.value))}
                                    onCheckedChange={(checked) => {
                                        setSelectedDays(prev =>
                                            checked
                                                ? [...prev, Number(weekday.value)]
                                                : prev.filter(d => d !== Number(weekday.value))
                                        );
                                    }}
                                />
                                <Label className="text-sm font-medium cursor-pointer w-full" htmlFor={`day-${weekday.value}`}>
                                    {weekday.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <ShiftsDataTable
                columns={columns as ColumnDef<Shift>[]}
                data={shifts}
                selectedDays={selectedDays}
                onEdit={handleEditShift}
                onDelete={(shift) => setShiftToDelete(shift)}
            />

            <ShiftDialog
                shift={editingShift}
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
                onShiftUpdate={router.refresh}
            />

            <UploadShiftsDialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
            />

            <AlertDialogDeleteShift
                shift={shiftToDelete}
                onOpenChange={(open) => setShiftToDelete(open ? shiftToDelete : null)}
                onDelete={handleDeleteShift}
            />
        </ConfigCardContainer>
    );
}