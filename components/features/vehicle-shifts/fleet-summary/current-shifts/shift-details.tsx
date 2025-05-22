'use client'

import type { VehicleCalendarEntry } from "@/types/domain/calendar/types"
import { VehicleStatusBadge } from "./vehicle-status-badge"
import { Badge } from "@/components/ui";
import { cn } from "@/utils/ui";

interface ShiftDetailsProps {
  shiftName: string;
  vehiclesInShift: VehicleCalendarEntry[];
}

export function ShiftDetails({ shiftName, vehiclesInShift }: ShiftDetailsProps) {
  const firstVehicleWithTimes = vehiclesInShift.find(v => v.startTime && v.endTime);
  const shiftTimeDisplay = firstVehicleWithTimes
    ? `(${firstVehicleWithTimes.startTime} - ${firstVehicleWithTimes.endTime})`
    : "";
  const title = shiftName === "Sin Turno Asignado"
    ? `${shiftName} - ${vehiclesInShift.length} móvil${vehiclesInShift.length === 1 ? '' : 'es'}`
    : `${shiftName} ${shiftTimeDisplay} - ${vehiclesInShift.length} móvil${vehiclesInShift.length === 1 ? '' : 'es'}`;

  console.log(vehiclesInShift);

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 border-b pb-1 flex items-center gap-6">
        <span className="font-bold">{title}</span>
        <Badge variant="outline" className={cn(firstVehicleWithTimes?.anexo_2_signed ? 'bg-green-200' : 'bg-red-200')}>
          {firstVehicleWithTimes?.anexo_2_signed ? 'Con Anexo 2' : 'Sin Anexo 2'}
        </Badge>
      </h4>
      <div className="flex flex-wrap">
        {vehiclesInShift
          .sort((a, b) => a.number - b.number)
          .map((vehicle: VehicleCalendarEntry) => (
            <VehicleStatusBadge key={vehicle.number} vehicle={vehicle} />
          ))}
      </div>
    </div>
  );
} 