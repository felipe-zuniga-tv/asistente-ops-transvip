'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  getVehicleStatuses,
  createVehicleStatus,
  updateVehicleStatus,
  deleteVehicleStatus,
} from '@/lib/features/vehicle-status'
import type { VehicleStatus, CreateVehicleStatusInput, UpdateVehicleStatusInput } from '@/types/domain/vehicle/types' // Updated import

// export type CreateVehicleStatusInput = Omit<VehicleStatus, 'id' | 'created_at' | 'updated_at' | 'status_label' | 'status_color'> & { // Removed
//   // If your API for createVehicleStatus expects `comments` as `string | undefined` rather than `string | null`
//   // you might need to transform it before calling, or adjust the type here / in VehicleStatus.
//   // For now, assuming Omit gives a close enough type or createVehicleStatus is flexible.
// };

// export type UpdateVehicleStatusInput = Partial<Omit<VehicleStatus, 'id' | 'created_at' | 'updated_at' | 'status_label' | 'status_color'> // Removed
// > & { vehicle_id?: string | number }; // vehicle_id might be part of update payload if not in URL

export function useVehicleStatus() {
  const [statuses, setStatuses] = useState<VehicleStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatuses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const fetchedStatuses = await getVehicleStatuses()
      setStatuses(fetchedStatuses || [])
    } catch (err: any) {
      console.error("Error fetching vehicle statuses:", err)
      setError(err.message || "Error al cargar los estados de los vehículos.")
      setStatuses([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  const addStatus = useCallback(async (newStatusData: CreateVehicleStatusInput) => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // If newStatusData.comments is null and your API expects undefined, you might do:
      // const apiPayload = { ...newStatusData, comments: newStatusData.comments === null ? undefined : newStatusData.comments };
      // const addedStatus = await createVehicleStatus(apiPayload);
      const addedStatus = await createVehicleStatus(newStatusData as any); // Using 'as any' for now, refine payload if strict typing needed
      await fetchStatuses(); // Refetch to get the latest list including the new one
      return addedStatus;
    } catch (err: any) {
      console.error("Error adding vehicle status:", err);
      setError(err.message || "Error al agregar el estado del vehículo.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatuses]);

  const updateStatus = useCallback(async (statusId: string | number, updates: UpdateVehicleStatusInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedStatus = await updateVehicleStatus(String(statusId), updates as any); // Ensure ID is string, using 'as any' for updates
      await fetchStatuses();
      return updatedStatus;
    } catch (err: any) {
      console.error("Error updating vehicle status:", err);
      setError(err.message || "Error al actualizar el estado del vehículo.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatuses]);

  const deleteStatus = useCallback(async (statusId: string | number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deleteVehicleStatus(String(statusId)); // Ensure ID is string
      await fetchStatuses(); // Refetch to update the list
    } catch (err: any) {
      console.error("Error deleting vehicle status:", err);
      setError(err.message || "Error al eliminar el estado del vehículo.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchStatuses]);

  return {
    statuses,
    isLoading,
    error,
    refetchStatuses: fetchStatuses,
    addStatus,
    updateStatus,
    deleteStatus,
  }
}
