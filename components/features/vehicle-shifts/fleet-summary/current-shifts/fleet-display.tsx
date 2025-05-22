'use client'

import type { VehicleCalendarEntry } from "@/types/domain/calendar/types"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ShiftDetails } from "./shift-details"
import { EmptyStateMessage } from "./empty-state-message"

interface FleetDisplayProps {
  vehiclesByShift: Record<string, VehicleCalendarEntry[]>;
  showOnlyActiveShifts: boolean;
}

export function FleetDisplay({ vehiclesByShift, showOnlyActiveShifts }: FleetDisplayProps) {
  const hasVehicles = Object.keys(vehiclesByShift).length > 0;

  if (!hasVehicles) {
    return (
      <EmptyStateMessage
        message={showOnlyActiveShifts
          ? "No hay vehículos con actividad actual o con algún estado para hoy en esta sucursal."
          : "No hay vehículos con turnos programados para hoy en esta sucursal."
        }
      />
    );
  }

  return (
    <TooltipProvider>
      {Object.entries(vehiclesByShift)
        .sort(([shiftA], [shiftB]) => shiftA.localeCompare(shiftB))
        .map(([shiftName, vehiclesInShift]) => (
          <ShiftDetails
            key={shiftName}
            shiftName={shiftName}
            vehiclesInShift={vehiclesInShift}
          />
        ))}
    </TooltipProvider>
  );
} 