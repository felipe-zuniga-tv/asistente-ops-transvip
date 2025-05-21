"use client";

import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from "@/components/ui/simple-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Input, Button, Label, Checkbox } from "@/components/ui";
import { createShift, updateShift } from "@/lib/features/vehicle-shifts";
import { useTransition, useCallback, useMemo } from "react";
import { WEEKDAYS, Shift } from "./shifts-definition";
import { useState, useEffect } from "react";
import { Branch } from "@/lib/core/types/admin";
import { getBranches } from "@/lib/features/admin"

interface ShiftDialogProps {
    shift?: Shift | null;
    isOpen: boolean;
    onClose: () => void;
    onShiftUpdate?: () => void;
}

const initialFormData = {
    name: "",
    start_time: "",
    end_time: "",
    free_day: 1,
    branch_id: "",
    anexo_2_signed: false,
};

export function ShiftDialog({
    shift,
    isOpen,
    onClose,
    onShiftUpdate, 
}: ShiftDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [formData, setFormData] = useState(initialFormData);

    const isEditing = Boolean(shift);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const branchesData = await getBranches();
                setBranches(branchesData);
            } catch (error) {
                console.error('Error fetching branches:', error);
                toast.error('Error al cargar las sucursales');
            }
        };

        if (isOpen) {
            fetchBranches();
        }
    }, [isOpen]);

    useEffect(() => {
        if (shift) {
            setFormData({
                name: shift.name,
                start_time: shift.start_time,
                end_time: shift.end_time,
                free_day: shift.free_day,
                branch_id: shift.branch_id,
                anexo_2_signed: Boolean(shift.anexo_2_signed),
            });
        } else {
            setFormData(initialFormData);
        }
    }, [shift]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        
        startTransition(async () => {
            try {
                if (isEditing && shift?.id) {
                    await updateShift(shift.id, formData);
                    toast.success("Turno actualizado exitosamente");
                    if (onShiftUpdate) onShiftUpdate(); 
                } else {
                    const selectedBranch = branches.find(b => b.id === formData.branch_id);
                    if (!selectedBranch) throw new Error("Sucursal no encontrada");
                    
                    const { branch_id, ...shiftData } = formData;
                    await createShift({ ...shiftData, branch_name: selectedBranch.name });
                    toast.success("Turno creado exitosamente");
                    if (onShiftUpdate) onShiftUpdate(); 
                }
                onClose();
            } catch (error) {
                toast.error(isEditing ? "Error al actualizar el turno" : "Error al crear el turno");
                console.error(error);
            }
        });
    }, [formData, isEditing, shift?.id, onClose, branches, onShiftUpdate]);

    const handleInputChange = useCallback((field: keyof typeof formData, value: string | number | boolean) => {
        if ((field === "start_time" || field === "end_time") && typeof value === 'string') {
            // Ensure the time is in HH:mm format
            const [hours, minutes] = value.split(':');
            const formattedTime = `${hours}:${minutes}`;
            setFormData(prev => ({ ...prev, [field]: formattedTime }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    }, []);

    const branchOptions = useMemo(() => 
        branches.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
            </SelectItem>
        )),
    [branches]);

    return (
        <SimpleDialog isOpen={isOpen} onClose={onClose}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>{isEditing ? "Editar" : "Nueva"} Jornada</SimpleDialogTitle>
            </SimpleDialogHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="branch_id">Sucursal</Label>
                    <Select
                        name="branch_id"
                        value={formData.branch_id}
                        onValueChange={(value) => handleInputChange("branch_id", value)}
                        required
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar sucursal" />
                        </SelectTrigger>
                        <SelectContent>
                            {branchOptions}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Nombre del Turno</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                    />
                </div>                    
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="startTime">Hora Inicio</Label>
                        <Input
                            id="startTime"
                            type="time"
                            value={formData.start_time}
                            onChange={(e) => handleInputChange("start_time", e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="endTime">Hora Fin</Label>
                        <Input
                            id="endTime"
                            type="time"
                            value={formData.end_time}
                            onChange={(e) => handleInputChange("end_time", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Día Libre</Label>
                    <Select 
                        value={formData.free_day.toString()}
                        onValueChange={(value) => handleInputChange("free_day", parseInt(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Seleccionar día libre" />
                        </SelectTrigger>
                        <SelectContent>
                            {WEEKDAYS.map((day) => (
                                <SelectItem key={day.value} value={day.value}>
                                    {day.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center justify-between gap-2 p-3 border rounded-md">
                    <Label htmlFor="anexo_2_signed">Anexo 2</Label>
                    <Checkbox
                        id="anexo_2_signed"
                        checked={formData.anexo_2_signed}
                        onCheckedChange={(checked) => handleInputChange("anexo_2_signed", checked === true)}
                    />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar"}
                    </Button>
                </div>
            </form>
        </SimpleDialog>
    );
} 