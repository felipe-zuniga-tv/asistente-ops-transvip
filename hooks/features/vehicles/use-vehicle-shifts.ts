'use client'
import { useState, useEffect, useCallback } from 'react'
import { addDays, format, parseISO, getDay } from 'date-fns'
import { getVehicleShiftsByDateRange } from '@/lib/features/vehicle-shifts'
import { getVehicleStatuses } from '@/lib/features/vehicle-status'
import { VEHICLE_STATUS } from '@/utils/constants'
import type { ShiftSummary } from '@/lib/core/types/calendar'

// Define the props for the hook
interface UseVehicleShiftsProps {
  currentDate: Date
  branchId?: string
}

// Type for individual vehicles within the summary, matching ShiftSummary['vehicles'][0]
// This ensures consistency with the ShiftSummary type from core types.
// isOnline is optional as it will be populated on demand.
type VehicleInShiftSummary = ShiftSummary['vehicles'][0];

export function useVehicleShifts({ currentDate, branchId }: UseVehicleShiftsProps) {
  const [summaries, setSummaries] = useState<ShiftSummary[]>([])
  const [vehicleStatusesData, setVehicleStatusesData] = useState<{ statuses: any[], loaded: boolean }>({ statuses: [], loaded: false });
  const [isLoading, setIsLoading] = useState(false) // For initial shifts loading
  const [error, setError] = useState<string | null>(null) // For initial shifts loading

  const [isLoadingOnlineStatus, setIsLoadingOnlineStatus] = useState(false); // For on-demand online status fetch
  const [onlineStatusError, setOnlineStatusError] = useState<string | null>(null); // For on-demand online status fetch
  const [vehicleOnlineStatusCache, setVehicleOnlineStatusCache] = useState<Map<number, boolean | undefined>>(new Map());
  // Flag to track if the global fetch for the current window has happened - REMOVED
  // const [hasFetchedAllOnlineStatusesForCurrentWindow, setHasFetchedAllOnlineStatusesForCurrentWindow] = useState(false);

  // Effect to load general vehicle statuses (maintenance, etc.) - runs once on mount
  useEffect(() => {
    async function loadVehicleStatuses() {
      try {
        const statuses = await getVehicleStatuses()
        setVehicleStatusesData({ statuses: statuses || [], loaded: true });
      } catch (err) {
        console.error("Error loading general vehicle statuses in hook:", err)
        setError("Error al cargar estados generales de vehículos.")
        setVehicleStatusesData({ statuses: [], loaded: true }); // Mark as loaded to proceed
      }
    }
    loadVehicleStatuses()
  }, [])

  // Main function to fetch shift data (without live online status initially)
  const fetchSummaries = useCallback(async () => {
    if (!currentDate || !vehicleStatusesData.loaded) {
      setSummaries([])
      setIsLoading(!!currentDate && !vehicleStatusesData.loaded);
      return
    }

    setIsLoading(true)
    setError(null)
    // Reset flag for global online status fetch when primary filters change - REMOVED
    // setHasFetchedAllOnlineStatusesForCurrentWindow(false); 
    // Clear cache if you want fresh live data on every primary filter change.
    // Or keep it to reuse statuses if vehicles are common across filter changes.
    // For now, let's clear it to ensure strictly "live" data for the new window.
    setVehicleOnlineStatusCache(new Map());

    try {
      const endDate = addDays(currentDate, 30)
      const startDateStr = format(currentDate, "yyyy-MM-dd")
      const endDateStr = format(endDate, "yyyy-MM-dd")

      const result = await getVehicleShiftsByDateRange(0, startDateStr, endDateStr, branchId)

      if (result.error) {
        setError(result.error)
        setSummaries([])
        setIsLoading(false)
        return
      }

      const shiftsMap = new Map<string, any[]>()
      let loopDate = new Date(currentDate)
      while (loopDate <= endDate) {
        shiftsMap.set(format(loopDate, "yyyy-MM-dd"), [])
        loopDate = addDays(loopDate, 1)
      }

      result.data?.forEach(shift => {
        const shiftStart = parseISO(shift.start_date)
        const shiftEnd = parseISO(shift.end_date)
        let currentShiftDay = new Date(shiftStart)

        while (currentShiftDay <= shiftEnd) {
          const dateStr = format(currentShiftDay, "yyyy-MM-dd")
          const dayOfWeek = getDay(currentShiftDay) === 0 ? 7 : getDay(currentShiftDay)

          if (shift.free_day !== undefined && shift.free_day === dayOfWeek) {
            currentShiftDay = addDays(currentShiftDay, 1)
            continue
          }

          const hasGeneralBlockerStatus = vehicleStatusesData.statuses.some(status => {
            if (status.vehicle_number !== shift.vehicle_number) return false
            const statusStart = parseISO(status.start_date)
            const statusEnd = parseISO(status.end_date)
            return currentShiftDay >= statusStart && currentShiftDay <= statusEnd
          })

          if (hasGeneralBlockerStatus) {
            currentShiftDay = addDays(currentShiftDay, 1)
            continue
          }

          if (shiftsMap.has(dateStr)) {
            const existingShifts = shiftsMap.get(dateStr) || []
            shiftsMap.set(dateStr, [...existingShifts, shift])
          }
          currentShiftDay = addDays(currentShiftDay, 1)
        }
      })

      const initialSummariesWithoutOnline: ShiftSummary[] = Array
        .from(shiftsMap.entries())
        .map(([date, shiftsData]) => ({
          date,
          vehicles: shiftsData.map(shift => ({
            number: shift.vehicle_number,
            shiftName: shift.shift_name,
            startTime: shift.start_time,
            endTime: shift.end_time,
            isOnline: undefined, // Online status will be populated later
          })).sort((a, b) => a.number - b.number),
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      setSummaries(initialSummariesWithoutOnline)
    } catch (err: any) {
      console.error("Error fetching shifts summary in hook:", err)
      setError(err.message || "Error al cargar el resumen de turnos.")
      setSummaries([])
    } finally {
      setIsLoading(false)
    }
  }, [currentDate, branchId, vehicleStatusesData.loaded]) // vehicleStatusesData.loaded ensures general statuses are there

  // Effect to run fetchSummaries when its dependencies change
  useEffect(() => {
    if (currentDate && vehicleStatusesData.loaded) {
      fetchSummaries()
    } else if (!currentDate) {
      setSummaries([])
      setIsLoading(false)
    } else if (currentDate && !vehicleStatusesData.loaded) {
      setIsLoading(true);
    }
  }, [currentDate, branchId, vehicleStatusesData.loaded, fetchSummaries])


  // Function to fetch online status for specific vehicles on demand
  const fetchAndApplyOnlineStatusesForVehicles = useCallback(async (vehicleNumbers: number[]) => {
    if (vehicleNumbers.length === 0) {
      return;
    }

    setIsLoadingOnlineStatus(true);
    setOnlineStatusError(null);

    // Filter out numbers for which status is already known (true or false, not undefined) from cache
    const numbersToFetch = vehicleNumbers.filter(num => vehicleOnlineStatusCache.get(num) === undefined);

    if (numbersToFetch.length > 0) {
      try {
        await Promise.all(
          numbersToFetch.map(async (vehicleNumber) => {
            try {
              const response = await fetch('/api/vehicle/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vehicleNumber }),
              });

              if (!response.ok) {
                let errorDetails = `Failed to fetch status for vehicle ${vehicleNumber}.`;
                try { const errorData = await response.json(); errorDetails = errorData.error || errorData.details || errorDetails; }
                catch (parseError) { /* Ignore */ }
                throw new Error(`API Error: ${response.status} - ${errorDetails}`);
              }
              const statusResult = await response.json();
              const isOnline = statusResult && (statusResult.status === VEHICLE_STATUS.ONLINE_AVAILABLE || statusResult.status === VEHICLE_STATUS.ONLINE_BUSY);
              
              // Update cache atomically 
              setVehicleOnlineStatusCache(prevCache => new Map(prevCache).set(vehicleNumber, isOnline));

            } catch (fetchStatusError: any) {
              console.error(`Error fetching live status for vehicle ${vehicleNumber}:`, fetchStatusError.message);
              // Cache 'undefined' on error for this specific vehicle to avoid retrying immediately for it,
              // but allow other vehicles in the batch to proceed.
              // Or, decide if 'undefined' means "try again later" vs "fetch failed, don't retry soon".
              // For now, let's set it to undefined, so a subsequent call for this vehicle *would* retry.
              // Or, we could set it to a specific error marker if needed.
              setVehicleOnlineStatusCache(prevCache => new Map(prevCache).set(vehicleNumber, undefined)); 
              throw fetchStatusError; // Propagate to Promise.all to be caught by outer catch
            }
          })
        );
      } catch (batchError) {
        console.error("Error during batch fetching of live online statuses:", batchError);
        setOnlineStatusError("Error al obtener el estado online de algunos vehículos.");
        // Even on batch error, proceed to apply what we have, some might have succeeded and updated the cache.
      }
    }

    // Apply newly fetched (and existing cached) statuses to all summaries
    // This ensures that if a vehicle is in multiple summaries, its status is updated everywhere
    setSummaries(prevSummaries =>
      prevSummaries.map(s => ({
        ...s,
        vehicles: s.vehicles.map(v => ({
          ...v,
          isOnline: vehicleOnlineStatusCache.get(v.number), // Always get from the potentially updated cache
        })),
      }))
    );

    // setHasFetchedAllOnlineStatusesForCurrentWindow(true); // REMOVED
    setIsLoadingOnlineStatus(false);

  }, [vehicleOnlineStatusCache]); // Dependency: vehicleOnlineStatusCache. fetch is stable.

  // Effect to trigger the one-time fetch for all unique vehicle online statuses for the current window - REMOVED
  // useEffect(() => {
  //   if (summaries.length > 0 && !hasFetchedAllOnlineStatusesForCurrentWindow && vehicleStatusesData.loaded && !isLoading) {
  //     // Check !isLoading to ensure fetchSummaries has completed
  //     fetchAndApplyAllOnlineStatuses();
  //   }
  // }, [summaries, hasFetchedAllOnlineStatusesForCurrentWindow, vehicleStatusesData.loaded, isLoading, fetchAndApplyAllOnlineStatuses]);


  return {
    summaries, // Will eventually contain isOnline status after the global fetch
    isLoading, // True when fetching initial shift data (the 30-day range)
    error,     // Error from initial shift data fetch
    refetchSummaries: fetchSummaries, // Will re-trigger the whole process
    fetchAndApplyOnlineStatusesForVehicles, // Exposed function for on-demand fetching
    isLoadingOnlineStatus, // True during the on-demand live online status fetch
    onlineStatusError,   // Error from the on-demand live online status fetch
  }
} 