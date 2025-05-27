'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2, Download, Upload, CheckSquare, XSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/tables/data-table'; // Assuming a generic DataTable component exists
import { ConfigCardContainer } from '@/components/ui/tables/config-card-container'; // Similar to shifts-definition
import { toast } from 'sonner'; // Assuming sonner for notifications
import { ColumnDef } from '@tanstack/react-table';

import type { DriverWithClearances, Division, Driver } from '@/types/domain/seguridad';
import {
  addDriver,
  updateDriver,
  deleteDriver,
  updateDriverClearances,
} from '../lib/actions';
import { ConductoresDialog } from './conductores-dialog'; // To be created for add/edit driver
import { ClearancesDialog } from './clearances-dialog'; // To be created for managing clearances
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'; // Assuming AlertDialog is available

interface ConductoresClientContentProps {
  initialDrivers: DriverWithClearances[];
  allDivisions: Division[];
}

export function ConductoresClientContent({
  initialDrivers,
  allDivisions,
}: ConductoresClientContentProps) {
  const router = useRouter();
  const [drivers, setDrivers] = useState<DriverWithClearances[]>(initialDrivers);
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false);
  const [isClearanceDialogOpen, setIsClearanceDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverWithClearances | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<DriverWithClearances | null>(null);
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);

  // Update client state if initialDrivers prop changes (e.g., after server-side refresh)
  useEffect(() => {
    setDrivers(initialDrivers);
  }, [initialDrivers]);

  const handleAddNewDriver = () => {
    setEditingDriver(null);
    setIsDriverDialogOpen(true);
  };

  const handleEditDriver = (driver: DriverWithClearances) => {
    setEditingDriver(driver);
    setIsDriverDialogOpen(true);
  };

  const handleManageClearances = (driver: DriverWithClearances) => {
    setEditingDriver(driver);
    setIsClearanceDialogOpen(true);
  };

  const handleDeleteDriver = (driver: DriverWithClearances) => {
    setDriverToDelete(driver);
    setIsConfirmDeleteDialogOpen(true);
  };

  const confirmDeleteDriver = async () => {
    if (!driverToDelete) return;
    try {
      await deleteDriver(driverToDelete.id);
      toast.success(`Conductor ${driverToDelete.name} eliminado.`);
      router.refresh(); // Re-fetch data on the server and update
    } catch (error) {
      toast.error('Error al eliminar el conductor.');
      console.error('Error deleting driver:', error);
    }
    setIsConfirmDeleteDialogOpen(false);
    setDriverToDelete(null);
  };

  const handleDriverDialogClose = () => {
    setIsDriverDialogOpen(false);
    setEditingDriver(null);
  };

  const handleClearanceDialogClose = () => {
    setIsClearanceDialogOpen(false);
    setEditingDriver(null);
  };

  const onDriverSave = async (values: Pick<Driver, 'fleet_id' | 'name'>, id?: string) => {
    try {
      if (id) {
        await updateDriver(id, values);
        toast.success('Conductor actualizado.');
      } else {
        await addDriver(values);
        toast.success('Conductor agregado.');
      }
      router.refresh();
      handleDriverDialogClose();
    } catch (error) {
      toast.error('Error al guardar el conductor.');
      console.error('Error saving driver:', error);
    }
  };

  const onClearancesSave = async (driverId: string, clearances: any[]) => {
    // `clearances` structure will depend on ClearancesDialog form
    try {
      await updateDriverClearances(driverId, clearances);
      toast.success('Habilitaciones actualizadas.');
      router.refresh();
      handleClearanceDialogClose();
    } catch (error) {
      toast.error('Error al actualizar habilitaciones.');
      console.error('Error updating clearances:', error);
    }
  };

  const columns: ColumnDef<DriverWithClearances>[] = useMemo(() => [
    { accessorKey: 'fleet_id', header: 'ID Flota' },
    { accessorKey: 'name', header: 'Nombre Conductor' },
    {
      id: 'clearances_summary',
      header: 'Habilitaciones (Divisiones)',
      cell: ({ row }) => {
        const driver = row.original;
        const clearedDivisions = driver.clearances
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
        const driver = row.original;
        return (
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleManageClearances(driver)} title="Gestionar Habilitaciones">
              <CheckSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleEditDriver(driver)} title="Editar Conductor">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDeleteDriver(driver)} title="Eliminar Conductor">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [router]); // Add dependencies if any function used in columns changes

  return (
    <ConfigCardContainer title="Gestión de Conductores y Habilitaciones" onAdd={handleAddNewDriver}>
      {/* Add Filters, Download/Upload buttons if needed, similar to ShiftsDefinition */}
      <DataTable columns={columns} data={drivers} />

      {isDriverDialogOpen && (
        <ConductoresDialog
          isOpen={isDriverDialogOpen}
          onClose={handleDriverDialogClose}
          onSave={onDriverSave}
          driver={editingDriver}
        />
      )}

      {isClearanceDialogOpen && editingDriver && (
        <ClearancesDialog
          isOpen={isClearanceDialogOpen}
          onClose={handleClearanceDialogClose}
          onSave={onClearancesSave}
          driver={editingDriver}
          allDivisions={allDivisions}
        />
      )}
      
      {/* Basic AlertDialog for delete confirmation */}
      {isConfirmDeleteDialogOpen && driverToDelete && (
         <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Eliminación</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Está seguro que desea eliminar al conductor {driverToDelete.name} (ID Flota: {driverToDelete.fleet_id})?
                  Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmDeleteDialogOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={confirmDeleteDriver}>Eliminar</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </ConfigCardContainer>
  );
} 