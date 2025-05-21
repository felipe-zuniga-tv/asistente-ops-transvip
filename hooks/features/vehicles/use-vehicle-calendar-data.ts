'use client'
import { useState, useEffect, useCallback } from 'react'
import { addDays, format, parseISO, getDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { getVehicleShiftsByDateRange } from '@/lib/features/vehicle-shifts'
import { getVehicleStatuses } from '@/lib/features/vehicle-status'
import { VEHICLE_STATUS } from '@/utils/constants' // For online status check

export interface VehicleStatusInfo {
  id: string
  label: string
  color: string
}

// Represents a single vehicle's state on a given day in the calendar
export interface VehicleCalendarEntry {
  number: number
  shiftName?: string // Original shift name
  startTime?: string // Original shift start time
  endTime?: string   // Original shift end time
  isOnline?: boolean // Live online status, if applicable
  statusInfo?: VehicleStatusInfo // Overriding general status (Taller, Mantención, etc.)
}

// Represents the summary for a single day in the calendar
export interface CalendarDaySummary {
  date: string // "yyyy-MM-dd"
  vehicles: VehicleCalendarEntry[]
}

interface UseVehicleCalendarDataProps {
  currentDate: Date // The starting date for the calendar view
  daysToShow: number // How many days from currentDate to show
  branchId?: string
}

export function useVehicleCalendarData({
  currentDate,
  daysToShow,
  branchId,
}: UseVehicleCalendarDataProps) {
  const [calendarDaysData, setCalendarDaysData] = useState<CalendarDaySummary[]>([])
  const [generalVehicleStatuses, setGeneralVehicleStatuses] = useState<any[]>([]) // Raw statuses from getVehicleStatuses
  const [isLoadingPrimaryData, setIsLoadingPrimaryData] = useState(false) // For shifts and general statuses
  const [isLoadingOnlineStatus, setIsLoadingOnlineStatus] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onlineStatusError, setOnlineStatusError] = useState<string | null>(null)
  const [vehicleOnlineStatusCache, setVehicleOnlineStatusCache] = useState<Map<number, boolean | undefined>>(new Map())

  const fetchPrimaryData = useCallback(async () => {
    // If no valid selection for search, don't proceed and ensure loading is false
    if (daysToShow === 0 || !branchId) {
      setCalendarDaysData([])
      setIsLoadingPrimaryData(false)
      setError(null) // Clear any previous errors
      return
    }
    if (!currentDate) {
      setCalendarDaysData([])
      setIsLoadingPrimaryData(false)
      return
    }

    setIsLoadingPrimaryData(true)
    setError(null)
    setVehicleOnlineStatusCache(new Map()) // Clear live status cache on primary data refresh

    try {
      // 1. Fetch general vehicle statuses (Taller, Mantención, etc.)
      const fetchedGeneralStatuses = await getVehicleStatuses() // Assuming this returns all relevant statuses
      setGeneralVehicleStatuses(fetchedGeneralStatuses || [])

      // 2. Fetch shifts for the date range
      const startDate = startOfDay(currentDate)
      const endDate = endOfDay(addDays(startDate, daysToShow - 1)) // Ensure full days coverage
      const startDateStr = format(startDate, "yyyy-MM-dd")
      const endDateStr = format(endDate, "yyyy-MM-dd")

      const shiftsResult = await getVehicleShiftsByDateRange(0, startDateStr, endDateStr, branchId)

      if (shiftsResult.error) {
        setError(shiftsResult.error)
        setCalendarDaysData([])
        setIsLoadingPrimaryData(false)
        return
      }

      // 3. Process and merge data
      const processedSummaries: CalendarDaySummary[] = []
      let loopDate = new Date(startDate)

      while (loopDate <= endDate) {
        const dateStr = format(loopDate, "yyyy-MM-dd")
        const vehiclesForDay: VehicleCalendarEntry[] = []
        const dayOfWeek = getDay(loopDate) === 0 ? 7 : getDay(loopDate) // Sunday is 0, make it 7 for consistency if needed by shift.free_day

        shiftsResult.data?.forEach(shift => {
          const shiftStartDate = parseISO(shift.start_date)
          const shiftEndDate = parseISO(shift.end_date)

          // Check if the current loopDate is within this shift's active period
          if (!isWithinInterval(loopDate, { start: startOfDay(shiftStartDate), end: endOfDay(shiftEndDate) })) {
            return;
          }
          
          // Check for free day
          if (shift.free_day !== undefined && shift.free_day === dayOfWeek) {
            return;
          }

          // Check for an overriding general status for this vehicle on this specific day
          const activeGeneralStatus = (fetchedGeneralStatuses || []).find(status => {
            if (status.vehicle_number !== shift.vehicle_number) return false
            const statusStart = parseISO(status.start_date)
            const statusEnd = parseISO(status.end_date)
            return isWithinInterval(loopDate, { start: startOfDay(statusStart), end: endOfDay(statusEnd) })
          })

          let vehicleEntry: VehicleCalendarEntry = {
            number: shift.vehicle_number,
            shiftName: shift.shift_name,
            startTime: shift.start_time,
            endTime: shift.end_time,
            isOnline: undefined, // To be fetched on demand if no overriding status
          }

          if (activeGeneralStatus) {
            vehicleEntry.statusInfo = {
              id: activeGeneralStatus.status_id, // Use status_id from the status object
              label: activeGeneralStatus.status_label, // Use status_label from the status object
              color: activeGeneralStatus.status_color, // Use status_color from the status object
            }
            // If there's a general status, online status from shift might be irrelevant or handled differently
            vehicleEntry.isOnline = undefined; 
          }
          
          vehiclesForDay.push(vehicleEntry)
        })

        processedSummaries.push({
          date: dateStr,
          vehicles: vehiclesForDay.sort((a, b) => a.number - b.number),
        })
        loopDate = addDays(loopDate, 1)
      }

      setCalendarDaysData(processedSummaries)
    } catch (err: any) {
      console.error("Error fetching primary calendar data in hook:", err)
      setError(err.message || "Error al cargar datos del calendario.")
      setCalendarDaysData([])
    } finally {
      setIsLoadingPrimaryData(false)
    }
  }, [currentDate, daysToShow, branchId])

  useEffect(() => {
    fetchPrimaryData()
  }, [fetchPrimaryData])

  const fetchAndApplyOnlineStatusesForVehicles = useCallback(async (vehicleNumbers: number[]) => {
    if (vehicleNumbers.length === 0) return

    setIsLoadingOnlineStatus(true)
    setOnlineStatusError(null)

    const numbersToFetch = vehicleNumbers.filter(num => vehicleOnlineStatusCache.get(num) === undefined)

    if (numbersToFetch.length > 0) {
      try {
        await Promise.all(
          numbersToFetch.map(async (vehicleNumber) => {
            try {
              const response = await fetch('/api/vehicle/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vehicleNumber }),
              })

              if (!response.ok) {
                let errorDetails = `Failed to fetch status for vehicle ${vehicleNumber}.`
                try { const errorData = await response.json(); errorDetails = errorData.error || errorData.details || errorDetails }
                catch (parseError) { /* Ignore */ }
                throw new Error(`API Error: ${response.status} - ${errorDetails}`)
              }
              const statusResult = await response.json()
              const isOnline = statusResult && (statusResult.status === VEHICLE_STATUS.ONLINE_AVAILABLE || statusResult.status === VEHICLE_STATUS.ONLINE_BUSY)
              
              setVehicleOnlineStatusCache(prevCache => new Map(prevCache).set(vehicleNumber, isOnline))
            } catch (fetchStatusError: any) {
              setVehicleOnlineStatusCache(prevCache => new Map(prevCache).set(vehicleNumber, undefined)) // Cache undefined on error
              throw fetchStatusError
            }
          })
        )
      } catch (batchError) {
        console.error("Error during batch fetching of live online statuses:", batchError)
        setOnlineStatusError("Error al obtener el estado online de algunos vehículos.")
      }
    }

    setCalendarDaysData(prevSummaries =>
      prevSummaries.map(daySummary => ({
        ...daySummary,
        vehicles: daySummary.vehicles.map(v => {
          // Only update isOnline if there isn't an overriding general status
          if (v.statusInfo) {
            return v; 
          }
          const newOnlineStatus = vehicleOnlineStatusCache.get(v.number);
          // Only update if newOnlineStatus is not undefined, or if it was already undefined (no change)
          // This prevents overriding a previously fetched true/false with undefined if cache was cleared for specific vehicle but not yet refetched
          return newOnlineStatus !== undefined || v.isOnline === undefined ? { ...v, isOnline: newOnlineStatus } : v;
        }),
      }))
    )
    setIsLoadingOnlineStatus(false)
  }, [vehicleOnlineStatusCache])

  // Automatic fetching of online statuses for vehicles in the current view that need it
  useEffect(() => {
    if (calendarDaysData.length > 0 && !isLoadingPrimaryData) {
      const allVehicleNumbersInViewNeedingStatus: Set<number> = new Set();
      calendarDaysData.forEach(day => {
        day.vehicles.forEach(v => {
          // Only consider fetching online status if NO overriding general status
          if (!v.statusInfo && vehicleOnlineStatusCache.get(v.number) === undefined) {
            allVehicleNumbersInViewNeedingStatus.add(v.number);
          }
        });
      });
      // if (allVehicleNumbersInViewNeedingStatus.size > 0) {
      //   fetchAndApplyOnlineStatusesForVehicles(Array.from(allVehicleNumbersInViewNeedingStatus));
      // }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarDaysData, isLoadingPrimaryData]); // Do not add vehicleOnlineStatusCache here to avoid loops

  return {
    calendarDaysData,
    isLoading: isLoadingPrimaryData, // isLoadingPrimaryData is the main loading state for shifts and general statuses
    error,
    refetchData: fetchPrimaryData,
    // fetchAndApplyOnlineStatusesForVehicles, // Expose if manual trigger is needed
    isLoadingOnlineStatus,
    onlineStatusError,
    generalVehicleStatuses, // Exposing this might be useful for debugging or other UI elements
  }
} 