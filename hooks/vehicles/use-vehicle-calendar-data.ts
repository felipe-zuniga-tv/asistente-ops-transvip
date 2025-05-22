'use client'

import { useState, useEffect, useCallback } from 'react'
import { addDays, format, parseISO, getDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns'
import { useVehicleStatus } from './use-vehicle-status'
import { getVehicleShiftsByDateRange } from '@/lib/features/vehicle-shifts'
import type { VehicleStatus} from '@/types/domain/vehicle/types'
import type { VehicleCalendarEntry, CalendarDaySummary } from '@/types/domain/calendar/types.ts'
import type { UseVehicleCalendarDataProps } from "@/types/hooks/features/vehicle";

export function useVehicleCalendarData({
  currentDate,
  daysToShow,
  branchId,
}: UseVehicleCalendarDataProps) {
  const [calendarDaysData, setCalendarDaysData] = useState<CalendarDaySummary[]>([])
  const [isLoadingPrimaryData, setIsLoadingPrimaryData] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { 
    statuses: getVehicleStatusList, 
    isLoading: isLoadingStatuses, 
  } = useVehicleStatus()

  const fetchPrimaryData = useCallback(async () => {
    if (daysToShow === 0 || !branchId) {
      setCalendarDaysData([])
      setIsLoadingPrimaryData(false)
      setError(null)
      return
    }
    if (!currentDate) {
      setCalendarDaysData([])
      setIsLoadingPrimaryData(false)
      return
    }

    if (isLoadingStatuses) {
      setIsLoadingPrimaryData(true)
      return;
    }

    setIsLoadingPrimaryData(true)
    setError(null)

    try {
      const fetchedGeneralStatuses: VehicleStatus[] = getVehicleStatusList || []

      const startDate = startOfDay(currentDate)
      const endDate = endOfDay(addDays(startDate, daysToShow - 1))
      const startDateStr = format(startDate, "yyyy-MM-dd")
      const endDateStr = format(endDate, "yyyy-MM-dd")

      const shiftsResult = await getVehicleShiftsByDateRange(0, startDateStr, endDateStr, branchId)

      if (shiftsResult.error) {
        setError(shiftsResult.error)
        setCalendarDaysData([])
        setIsLoadingPrimaryData(false)
        return
      }

      const processedSummaries: CalendarDaySummary[] = []
      let loopDate = new Date(startDate)

      while (loopDate <= endDate) {
        const dateStr = format(loopDate, "yyyy-MM-dd")
        const vehiclesForDay: VehicleCalendarEntry[] = []
        const dayOfWeek = getDay(loopDate) === 0 ? 7 : getDay(loopDate)
        
        shiftsResult.data?.forEach((shift: any) => {
          const shiftStartDate = parseISO(shift.start_date)
          const shiftEndDate = parseISO(shift.end_date)

          if (!isWithinInterval(loopDate, { start: startOfDay(shiftStartDate), end: endOfDay(shiftEndDate) })) {
            return;
          }
          
          if (shift.free_day !== undefined && shift.free_day === dayOfWeek) {
            return;
          }

          const activeGeneralStatus = fetchedGeneralStatuses.find(status => {
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
            anexo_2_signed: shift.anexo_2_signed,
          }

          if (activeGeneralStatus) {
            vehicleEntry.statusInfo = {
              id: activeGeneralStatus.status_id,
              label: activeGeneralStatus.status_label,
              // color: activeGeneralStatus.status_color,
            }
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
  }, [currentDate, daysToShow, branchId, getVehicleStatusList, isLoadingStatuses])

  useEffect(() => {
    fetchPrimaryData()
  }, [fetchPrimaryData])

  return {
    calendarDaysData,
    isLoading: isLoadingPrimaryData || isLoadingStatuses,
    error,
    refetchData: fetchPrimaryData,
    vehicleStatusList: getVehicleStatusList,
  }
} 