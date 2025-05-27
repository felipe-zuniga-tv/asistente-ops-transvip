'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type {
  Driver, Division, DriverDivisionClearance, DriverWithClearances,
  Vehicle, VehicleWithClearances, VehicleDivisionClearance
} from '@/types/domain/seguridad/types';


export async function getDriversWithClearances(): Promise<DriverWithClearances[]> {
  const supabase = await createClient();
  const { data: drivers, error: driversError } = await supabase
    .schema('safety')
    .from('drivers')
    .select('*, driver_division_clearances(*, divisions(name))')
    .order('name', { ascending: true });

  if (driversError) {
    console.error('Error fetching drivers:', driversError);
    throw new Error('Could not fetch drivers.');
  }

  return (drivers || []).map((driver: any) => ({
    ...driver,
    clearances: (driver.driver_division_clearances || []).map((clearance: any) => ({
      ...clearance,
      division_name: clearance.divisions?.name
    }))
  })) as DriverWithClearances[];
}

export async function getAllDivisions(): Promise<Division[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('safety')
    .from('divisions')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching divisions:', error);
    throw new Error('Could not fetch divisions.');
  }
  return data || [];
}

export async function updateDriverClearances(
  driverId: string,
  clearancesToUpdate: Array<Pick<DriverDivisionClearance, 'division_id' | 'is_cleared' | 'status' | 'valid_from' | 'valid_until'>>
): Promise<void> {
  const supabase = await createClient();

  const { data: existingClearances, error: fetchError } = await supabase
    .schema('safety')
    .from('driver_division_clearances')
    .select('division_id')
    .eq('driver_id', driverId)

  if (fetchError) {
    console.error('Error fetching existing driver clearances:', fetchError);
    throw new Error('Could not update driver clearances.');
  }

  const existingDivisionIds = existingClearances?.map(c => c.division_id) || [];
  const newDivisionIds = clearancesToUpdate.map(c => c.division_id);

  const clearancesForDb = clearancesToUpdate.map(c => ({
    driver_id: driverId,
    division_id: c.division_id,
    is_cleared: c.is_cleared,
    status: c.status,
    valid_from: c.valid_from,
    valid_until: c.valid_until,
    updated_at: new Date().toISOString(),
  }));

  const toUpsert = clearancesForDb;
  const toDelete = existingDivisionIds.filter(id => !newDivisionIds.includes(id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .schema('safety')
      .from('driver_division_clearances')
      .delete()
      .eq('driver_id', driverId)
      .in('division_id', toDelete)

    if (deleteError) {
      console.error('Error deleting old driver clearances:', deleteError);
    }
  }

  if (toUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .schema('safety')
      .from('driver_division_clearances')
      .upsert(toUpsert, { onConflict: 'driver_id,division_id' })

    if (upsertError) {
      console.error('Error upserting driver clearances:', upsertError);
      throw new Error('Could not update driver clearances.');
    }
  }
}

// Add other actions like addDriver, updateDriver, deleteDriver as needed.

export async function addDriver(driverData: Pick<Driver, 'fleet_id' | 'name'>): Promise<Driver> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('safety')
    .from('drivers')
    .insert([{
      fleet_id: driverData.fleet_id,
      name: driverData.name,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding driver:', error);
    throw new Error('Could not add driver.');
  }
  return data as Driver;
}

export async function updateDriver(driverId: string, driverData: Partial<Pick<Driver, 'fleet_id' | 'name'>>): Promise<Driver> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('safety')
    .from('drivers')
    .update(driverData)
    .eq('id', driverId)
    .select()
    .single();

  if (error) {
    console.error('Error updating driver:', error);
    throw new Error('Could not update driver.');
  }
  return data as Driver;
}

export async function deleteDriver(driverId: string): Promise<void> {
  const supabase = await createClient();
  // Note: RLS should ensure only authorized users can delete.
  // ON DELETE CASCADE for driver_division_clearances and SET NULL for driver_vehicle_assignments will handle related records.
  const { error } = await supabase
    .schema('safety')
    .from('drivers')
    .delete()
    .eq('id', driverId)

  if (error) {
    console.error('Error deleting driver:', error);
    throw new Error('Could not delete driver.');
  }
}

export async function getVehiclesWithClearances(): Promise<VehicleWithClearances[]> {
  const supabase = await createClient();
  const { data: vehicles, error: vehiclesError } = await supabase
    .schema('safety')
    .from('vehicles')
    .select('*, vehicle_division_clearances(*, divisions(name))')

  if (vehiclesError) {
    console.error('Error fetching vehicles:', vehiclesError);
    throw new Error('Could not fetch vehicles.');
  }

  return (vehicles || []).map((vehicle: any) => ({
    ...vehicle,
    clearances: (vehicle.vehicle_division_clearances || []).map((clearance: any) => ({
      ...clearance,
      division_name: clearance.divisions?.name
    }))
  })) as VehicleWithClearances[];
}

export async function addVehicle(vehicleData: Pick<Vehicle, 'vehicle_number' | 'make_model'>): Promise<Vehicle> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('safety')
    .from('vehicles')
    .insert([{
      vehicle_number: vehicleData.vehicle_number,
      make_model: vehicleData.make_model,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding vehicle:', error);
    throw new Error('Could not add vehicle.');
  }
  return data as Vehicle;
}

export async function updateVehicle(vehicleId: string, vehicleData: Partial<Pick<Vehicle, 'vehicle_number' | 'make_model'>>): Promise<Vehicle> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .schema('safety')
    .from('vehicles')
    .update(vehicleData)
    .eq('id', vehicleId)
    .select()
    .single();

  if (error) {
    console.error('Error updating vehicle:', error);
    throw new Error('Could not update vehicle.');
  }
  return data as Vehicle;
}

export async function deleteVehicle(vehicleId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .schema('safety')
    .from('vehicles')
    .delete()
    .eq('id', vehicleId);

  if (error) {
    console.error('Error deleting vehicle:', error);
    throw new Error('Could not delete vehicle.');
  }
}

export async function updateVehicleClearances(
  vehicleId: string,
  clearancesToUpdate: Array<Pick<VehicleDivisionClearance, 'division_id' | 'is_cleared' | 'status' | 'valid_from' | 'valid_until'>>
): Promise<void> {
  const supabase = await createClient();

  const { data: existingClearances, error: fetchError } = await supabase
    .schema('safety')
    .from('vehicle_division_clearances')
    .select('division_id')
    .eq('vehicle_id', vehicleId);

  if (fetchError) {
    console.error('Error fetching existing vehicle clearances:', fetchError);
    throw new Error('Could not update vehicle clearances.');
  }

  const existingDivisionIds = existingClearances?.map(c => c.division_id) || [];
  const newDivisionIds = clearancesToUpdate.map(c => c.division_id);

  const clearancesForDb = clearancesToUpdate.map(c => ({
    vehicle_id: vehicleId,
    division_id: c.division_id,
    is_cleared: c.is_cleared,
    status: c.status,
    valid_from: c.valid_from,
    valid_until: c.valid_until,
    updated_at: new Date().toISOString(),
  }));

  const toUpsert = clearancesForDb;
  const toDelete = existingDivisionIds.filter(id => !newDivisionIds.includes(id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .schema('safety')
      .from('vehicle_division_clearances')
      .delete()
      .eq('vehicle_id', vehicleId)
      .in('division_id', toDelete)

    if (deleteError) {
      console.error('Error deleting old vehicle clearances:', deleteError);
    }
  }

  if (toUpsert.length > 0) {
    const { error: upsertError } = await supabase
      .schema('safety')
      .from('vehicle_division_clearances')
      .upsert(toUpsert, { onConflict: 'vehicle_id,division_id' })

    if (upsertError) {
      console.error('Error upserting vehicle clearances:', upsertError);
      throw new Error('Could not update vehicle clearances.');
    }
  }
} 