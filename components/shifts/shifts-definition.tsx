"use client";

import { useEffect, useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShiftDialog } from "./shift-dialog";
import { deleteShift } from "@/lib/database/actions";
import { UploadShiftsDialog } from "./upload-shifts-dialog";
import { ShiftsDataTable } from "./table/shifts-data-table";
import { columns } from "./table/columns";
import { useRouter } from "next/navigation";
import { AlertDialogDeleteShift } from "./delete-shift-alert-dialog";
import { toast } from "sonner";
import { ConfigCardContainer } from "../tables/config-card-container";
import { downloadFile } from "@/lib/utils/file";

export const WEEKDAYS = [
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
    { value: "6", label: "Sábado" },
    { value: "7", label: "Domingo" },
];

export interface Shift {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    free_day: number;
    branch_id: string;
    branch_name: string;
    created_timestamp: string;
}

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
        if (!isDialogOpen || !editingShift) {
            // Pushing the change to the end of the call stack
            const timer = setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 0);
      
            return () => clearTimeout(timer);
          } else {
            document.body.style.pointerEvents = "auto";
          }
    }, [isDialogOpen, editingShift]);

    const handleEditShift = (shift: Shift) => {
        setEditingShift(shift);
        setIsDialogOpen(true);
    };

    const handleDialogClose = async () => {
        setIsDialogOpen(false);
        setEditingShift(null);
        router.refresh();
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    const handleDeleteShift = async (shift: Shift) => {
        try {
            await deleteShift(shift.id);
            router.refresh();
            toast.success("Turno eliminado exitosamente");

            setTimeout(() => {
                window.location.reload();
            }, 100);
        } catch (error) {
            console.error('Error deleting shift:', error);
            toast.error("Error al eliminar el turno");
        }
    };

    const generateShiftsTemplate = () => {
        const headers = ["Sucursal", "Nombre", "Hora Inicio", "Hora Fin", "Día Libre"]
        const example = ["Santiago", "Turno AM", "08:00", "16:00", "1"]
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
        <ConfigCardContainer
            title="Jornadas de Conexión"
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
                columns={columns}
                data={shifts}
                selectedDays={selectedDays}
                onEdit={handleEditShift}
                onDelete={(shift) => setShiftToDelete(shift)}
            />

            <ShiftDialog
                shift={editingShift}
                open={isDialogOpen}
                onOpenChange={handleDialogClose}
            />

            <UploadShiftsDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
            />

            <AlertDialogDeleteShift
                shift={shiftToDelete}
                onOpenChange={(open) => setShiftToDelete(open ? shiftToDelete : null)}
                onDelete={handleDeleteShift}
            />
        </ConfigCardContainer>
    );
}