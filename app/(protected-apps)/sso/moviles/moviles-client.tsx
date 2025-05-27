'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/tables/data-table';
import { ConfigCardContainer } from '@/components/ui/tables/config-card-container';
import { toast } from 'sonner';
import { ColumnDef } from '@tanstack/react-table';

import type { VehicleWithClearances, Division, Vehicle } from '@/types/domain/seguridad/types';
import {
  addVehicle,
  updateVehicle,
  deleteVehicle,
  updateVehicleClearances,
} from '../lib/actions'; 
import { MovilesDialog } from './moviles-dialog'; 
import { VehicleClearancesDialog } from './clearances-dialog'; 
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface MovilesClientContentProps {
  initialVehicles: VehicleWithClearances[];
  allDivisions: Division[];
}

export function MovilesClientContent({
  initialVehicles,
  allDivisions,
}: MovilesClientContentProps) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleWithClearances[]>(initialVehicles);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [isClearanceDialogOpen, setIsClearanceDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleWithClearances | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<VehicleWithClearances | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  const handleAddNewVehicle = () => {
    setEditingVehicle(null);
    setIsVehicleDialogOpen(true);
  };

  const handleEditVehicle = (vehicle: VehicleWithClearances) => {
    setEditingVehicle(vehicle);
    setIsVehicleDialogOpen(true);
  };

  const handleManageClearances = (vehicle: VehicleWithClearances) => {
    setEditingVehicle(vehicle);
    setIsClearanceDialogOpen(true);
  };

  const handleDeleteVehicle = (vehicle: VehicleWithClearances) => {
    setVehicleToDelete(vehicle);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle(vehicleToDelete.id);
      toast.success(`Móvil ${vehicleToDelete.vehicle_number} eliminado.`);
      router.refresh();
    } catch (error) {
      toast.error('Error al eliminar el móvil.');
      console.error('Error deleting vehicle:', error);
    }
    setIsConfirmDeleteDialogOpen(false);
    setVehicleToDelete(null);
  };

  const handleVehicleDialogClose = () => {
    setIsVehicleDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleClearanceDialogClose = () => {
    setIsClearanceDialogOpen(false);
    setEditingVehicle(null);
  };

  const onVehicleSave = async (values: Pick<Vehicle, 'vehicle_number' | 'make_model'>, id?: string) => {
    try {
      if (id) {
        await updateVehicle(id, values);
        toast.success('Móvil actualizado.');
      } else {
        await addVehicle(values);
        toast.success('Móvil agregado.');
      }
      router.refresh();
      handleVehicleDialogClose();
    } catch (error) {
      toast.error('Error al guardar el móvil.');
      console.error('Error saving vehicle:', error);
    }
  };

  const onClearancesSave = async (vehicleId: string, clearances: any[]) => {
    try {
      await updateVehicleClearances(vehicleId, clearances);
      toast.success('Habilitaciones de móvil actualizadas.');
      router.refresh();
      handleClearanceDialogClose();
    } catch (error) {
      toast.error('Error al actualizar habilitaciones del móvil.');
      console.error('Error updating vehicle clearances:', error);
    }
  };

 const columns: ColumnDef<VehicleWithClearances>[] = useMemo(() => [
    { accessorKey: 'vehicle_number', header: 'Nº Móvil' },
    { accessorKey: 'make_model', header: 'Marca/Modelo' },
    {
      id: 'clearances_summary',
      header: 'Habilitaciones (Divisiones)',
      cell: ({ row }) => {
        const vehicle = row.original;
        const clearedDivisions = vehicle.clearances
          .filter(c => c.is_cleared && c.division_name)
          .map(c => c.division_name)
          .join(', ');
        return clearedDivisions || <span className="text-xs text-muted-foreground">Sin habilitaciones</span>;
      },
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const vehicle = row.original;
        return (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleManageClearances(vehicle)} title="Gestionar Habilitaciones">
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)} title="Editar Móvil">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteVehicle(vehicle)} title="Eliminar Móvil">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [router]);

  return (
    <ConfigCardContainer title="Gestión de Móviles y Habilitaciones" onAdd={handleAddNewVehicle}>
      <DataTable columns={columns} data={vehicles} />

      {isVehicleDialogOpen && (
        <MovilesDialog
          isOpen={isVehicleDialogOpen}
          onClose={handleVehicleDialogClose}
          onSave={onVehicleSave}
          vehicle={editingVehicle}
        />
      )}

      {isClearanceDialogOpen && editingVehicle && (
        <VehicleClearancesDialog
          isOpen={isClearanceDialogOpen}
          onClose={handleClearanceDialogClose}
          onSave={onClearancesSave}
          vehicle={editingVehicle} 
          allDivisions={allDivisions}
        />
      )}
      
      {isConfirmDeleteDialogOpen && vehicleToDelete && (
         <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Está seguro que desea eliminar el móvil {vehicleToDelete.vehicle_number} ({vehicleToDelete.make_model})?
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={confirmDeleteVehicle}>Eliminar</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </ConfigCardContainer>
  );
} 