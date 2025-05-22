'use client'

import { Label, Switch } from "@/components/ui"

interface ActiveShiftsToggleProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ActiveShiftsToggle({ isChecked, onCheckedChange }: ActiveShiftsToggleProps) {
  return (
    <div className="flex items-center gap-2 pt-3">
      <Switch
        id="active-shifts-filter"
        checked={isChecked}
        onCheckedChange={onCheckedChange}
        aria-label="Filtrar móviles por actividad actual"
      />
      <Label htmlFor="active-shifts-filter" className="text-sm text-muted-foreground cursor-pointer">
        Mostrar todos los turnos
      </Label>
    </div>
  );
} 