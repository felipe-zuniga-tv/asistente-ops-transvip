"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { createShift, updateShift } from "@/lib/database/actions";
import { useTransition } from "react";
import { WEEKDAYS, Shift } from "./shifts-definition";
import { useState, useEffect } from "react";

interface ShiftDialogProps {
    shift?: Shift | null;
    open: boolean;
    onOpenChange: () => void;
}

export function ShiftDialog({ shift, open, onOpenChange }: ShiftDialogProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState({
        name: "",
        start_time: "",
        end_time: "",
        free_day: 1,
    });

    const isEditing = Boolean(shift);

    useEffect(() => {
        if (shift) {
            setFormData({
                name: shift.name,
                start_time: shift.start_time,
                end_time: shift.end_time,
                free_day: shift.free_day,
            });
        } else {
            setFormData({
                name: "",
                start_time: "",
                end_time: "",
                free_day: 1,
            });
        }
    }, [shift]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        startTransition(async () => {
            try {
                if (isEditing && shift?.id) {
                    await updateShift(shift.id, formData);
                    toast.success("Turno actualizado exitosamente");
                } else {
                    await createShift(formData);
                    toast.success("Turno creado exitosamente");
                }
                onOpenChange();
            } catch (error) {
                toast.error(isEditing ? "Error al actualizar el turno" : "Error al crear el turno");
                console.error(error);
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Editar" : "Nueva"} Jornada</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Turno</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">Hora Inicio</Label>
                            <Input
                                id="startTime"
                                type="time"
                                value={formData.start_time}
                                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endTime">Hora Fin</Label>
                            <Input
                                id="endTime"
                                type="time"
                                value={formData.end_time}
                                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Día Libre</Label>
                        <Select 
                            value={formData.free_day.toString()}
                            onValueChange={(value) => setFormData({ ...formData, free_day: parseInt(value) })}
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
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange()}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 