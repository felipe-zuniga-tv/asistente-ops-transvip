'use client'
import { useState, useCallback, useEffect } from 'react'
import { VEHICLE_STATUS } from '@/utils/constants'
import type { VehicleOnlineStatus } from "@/types/domain/vehicle/types";
import type { UseVehicleOnlineStatusReturn } from "@/types/hooks/features/vehicle";

const ONLINE_STATUS_CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export function useVehicleOnlineStatus(
  initialVehicleNumbers: number[] = []
): UseVehicleOnlineStatusReturn {
  const [vehicleOnlineStatusData, setVehicleOnlineStatusData] = useState<Map<number, VehicleOnlineStatus>>(new Map())
  const [isLoadingOnlineStatus, setIsLoadingOnlineStatus] = useState(false)
  const [onlineStatusError, setOnlineStatusError] = useState<string | null>(null)

  const fetchOnlineStatuses = useCallback(async (vehicleNumbers: number[]) => {
    if (vehicleNumbers.length === 0) {
      // If called with empty array, ensure loading is false and no new error is set.
      // Existing errors/data for other vehicles should persist unless explicitly cleared.
      setIsLoadingOnlineStatus(false);
      return;
    }

    setIsLoadingOnlineStatus(true)
    // Keep existing errors for unrelated vehicles, but clear general error for this batch.
    setOnlineStatusError(null)

    const now = Date.now()
    const numbersToFetchImmediately: number[] = []
    const currentStatusData = new Map(vehicleOnlineStatusData);

    for (const num of vehicleNumbers) {
      const cachedEntry = currentStatusData.get(num)
      if (!cachedEntry || (now - cachedEntry.timestamp > ONLINE_STATUS_CACHE_DURATION_MS) || cachedEntry.error) {
        numbersToFetchImmediately.push(num)
      }
    }

    if (numbersToFetchImmediately.length > 0) {
      try {
        const statusPromises = numbersToFetchImmediately.map(async (vehicleNumber) => {
          try {
            const response = await fetch('/api/vehicle/status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ vehicleNumber }),
            })

            if (!response.ok) {
              let errorDetails = `Failed to fetch status for vehicle ${vehicleNumber}.`
              try {
                const errorData = await response.json()
                errorDetails = errorData.error || errorData.details || errorDetails
              } catch (parseError) { /* Ignore */ }
              return { vehicleNumber, isOnline: undefined, error: errorDetails, timestamp: Date.now() }
            }
            const statusResult = await response.json()
            const isOnline = statusResult && (statusResult.status === VEHICLE_STATUS.ONLINE_AVAILABLE || statusResult.status === VEHICLE_STATUS.ONLINE_BUSY)
            return { vehicleNumber, isOnline, error: null, timestamp: Date.now() }
          } catch (fetchStatusError: any) {
            return { vehicleNumber, isOnline: undefined, error: fetchStatusError.message || 'Fetch error', timestamp: Date.now() }
          }
        })

        const results = await Promise.allSettled(statusPromises)

        setVehicleOnlineStatusData(prevCache => {
          const newCache = new Map(prevCache)
          results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
              const { vehicleNumber, isOnline, error, timestamp } = result.value
              newCache.set(vehicleNumber, { isOnline, timestamp, error })
            } else if (result.status === 'rejected') {
              // This case should ideally not happen if individual fetches catch their errors
              // console.error("Unhandled rejection in statusPromises:", result.reason);
              // Potentially set a general error or handle specific vehicle errors if vehicleNumber is accessible
            }
          })
          return newCache
        })

        const fetchErrors = results
          .filter(r => r.status === 'fulfilled' && r.value && r.value.error)
          .map(r => (r.status === 'fulfilled' && r.value ? r.value.error : 'Unknown error'))

        if (fetchErrors.length > 0) {
          setOnlineStatusError(`No se pudo obtener el estado de ${fetchErrors.length} vehículo(s). Detalles: ${fetchErrors.join(', ')}`)
        }
      } catch (batchError) {
        console.error("Error during batch processing of online statuses:", batchError)
        setOnlineStatusError("Error general al obtener estados online.")
      }
    }
    setIsLoadingOnlineStatus(false)
  }, [vehicleOnlineStatusData]) // Dependency on vehicleOnlineStatusData to re-evaluate cache needs correctly

  useEffect(() => {
    if (initialVehicleNumbers.length > 0) {
      // Initial fetch for any numbers provided on hook mount, respecting cache.
      fetchOnlineStatuses(initialVehicleNumbers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount if initialVehicleNumbers are provided. fetchOnlineStatuses is memoized.


  return {
    vehicleOnlineStatusData,
    isLoadingOnlineStatus,
    onlineStatusError,
    fetchOnlineStatuses,
  }
} 