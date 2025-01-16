"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { updateShift } from "@/lib/database/actions";
import { toast } from "sonner";
import { useTransition } from "react";
import { Shift, WEEKDAYS } from "./shifts-content";

interface EditShiftDialogProps {
  shift: Shift;
  open: boolean;
  onOpenChange: () => void;
}

export function EditShiftDialog({ shift, open, onOpenChange }: EditShiftDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    start_time: "",
    end_time: "",
    free_day: 1,
  });

  useEffect(() => {
    if (shift) {
      setFormData({
        name: shift.name,
        start_time: shift.start_time,
        end_time: shift.end_time,
        free_day: shift.free_day,
      });
    }
  }, [shift]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shift?.id) return;

    startTransition(async () => {
      try {
        await updateShift(shift.id, formData);
        toast.success("Turno actualizado exitosamente");
        onOpenChange();
      } catch (error) {
        toast.error("Error al actualizar el turno");
        console.error(error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Jornada</DialogTitle>
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
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
