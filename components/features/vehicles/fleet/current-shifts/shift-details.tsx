'use client'

import type { VehicleCalendarEntry } from "@/hooks/features/vehicles/use-vehicle-calendar-data"
import { VehicleStatusBadge } from "./vehicle-status-badge"

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

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2 border-b pb-1">
        {title}
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