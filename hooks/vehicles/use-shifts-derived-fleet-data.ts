import { useMemo } from "react";
import { isWithinInterval, setHours, setMinutes, setSeconds, setMilliseconds, addDays } from "date-fns"
import type { CalendarDaySummary, VehicleCalendarEntry as BaseVehicleCalendarEntry } from "@/types/domain/calendar/types"
import type { VehicleOnlineStatus } from "@/types/domain/vehicle/types"

// Define a new type for the vehicle entry that includes online status
interface EnrichedVehicleCalendarEntry extends BaseVehicleCalendarEntry {
    isOnline?: boolean;
    lastOnlineStatusUpdate?: number;
}

// Helper hook to derive displayed vehicles and vehicles by shift
export function useDerivedFleetData(
    currentDaySummary: CalendarDaySummary | null,
    showOnlyActiveShifts: boolean,
    today: Date,
    vehicleOnlineStatusData: Map<number, VehicleOnlineStatus>
) {
    const enrichedVehiclesForDay = useMemo(() => {
        if (!currentDaySummary?.vehicles) return [];
        return currentDaySummary.vehicles.map(vehicle => {
            const onlineStatus = vehicleOnlineStatusData.get(vehicle.number);
            return {
                ...vehicle,
                isOnline: onlineStatus?.isOnline,
                lastOnlineStatusUpdate: onlineStatus?.timestamp,
            };
        }) as EnrichedVehicleCalendarEntry[];
    }, [currentDaySummary, vehicleOnlineStatusData]);

    const displayedVehicles = useMemo(() => {
        if (!enrichedVehiclesForDay) return [];

        if (showOnlyActiveShifts) {
            const now = new Date();
            return enrichedVehiclesForDay.filter((vehicle: EnrichedVehicleCalendarEntry) => {
                if (vehicle.statusInfo) { // Rule 1: Always include if statusInfo exists
                    return true;
                }
                // Rule 2: For vehicles WITHOUT statusInfo, include only if their shift is currently active
                if (vehicle.startTime && vehicle.endTime) {
                    try {
                        const [startHour, startMinute] = vehicle.startTime.split(':').map(Number);
                        const [endHour, endMinute] = vehicle.endTime.split(':').map(Number);
                        const shiftStartDateTime = setMilliseconds(setSeconds(setMinutes(setHours(today, startHour), startMinute), 0), 0);
                        let shiftEndDateTime = setMilliseconds(setSeconds(setMinutes(setHours(today, endHour), endMinute), 0), 0);
                        if (shiftEndDateTime < shiftStartDateTime) { // Handles overnight shifts
                            shiftEndDateTime = addDays(shiftEndDateTime, 1);
                        }
                        return isWithinInterval(now, { start: shiftStartDateTime, end: shiftEndDateTime });
                    } catch (e) {
                        console.warn("Error parsing shift times for vehicle:", vehicle.number, e);
                        return false;
                    }
                }
                return false; // No statusInfo and (no shift times OR shift not currently active)
            });
        }
        // If showOnlyActiveShifts is false, show all enriched vehicles for the day
        return enrichedVehiclesForDay;
    }, [enrichedVehiclesForDay, showOnlyActiveShifts, today]);

    const vehiclesByShift = useMemo(() => {
        if (!displayedVehicles || displayedVehicles.length === 0) return {};
        return displayedVehicles.reduce((acc, vehicle) => {
            const shiftKey = vehicle.shiftName || "Sin Turno Asignado";
            if (!acc[shiftKey]) acc[shiftKey] = [];
            acc[shiftKey].push(vehicle);
            return acc;
        }, {} as Record<string, EnrichedVehicleCalendarEntry[]>);
    }, [displayedVehicles]);

    return { displayedVehicles, vehiclesByShift };
}