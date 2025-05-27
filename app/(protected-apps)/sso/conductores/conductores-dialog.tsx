'use client';

import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import type { Driver } from '@/types/domain/seguridad';

const driverFormSchema = z.object({
  fleet_id: z.string().min(1, 'El ID de flota es requerido.'),
  name: z.string().min(1, 'El nombre es requerido.'),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface ConductoresDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Pick<Driver, 'fleet_id' | 'name'>, id?: string) => Promise<void>;
  driver: Pick<Driver, 'id' | 'fleet_id' | 'name'> | null; // Use Pick for relevant fields
}

export function ConductoresDialog({
  isOpen,
  onClose,
  onSave,
  driver,
}: ConductoresDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      fleet_id: '',
      name: '',
    },
  });

  useEffect(() => {
    if (driver) {
      reset({
        fleet_id: driver.fleet_id,
        name: driver.name,
      });
    } else {
      reset({ fleet_id: '', name: '' });
    }
  }, [driver, reset, isOpen]); // Depend on isOpen to reset form when dialog opens

  const onSubmit = async (data: DriverFormValues) => {
    await onSave(data, driver?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{driver ? 'Editar Conductor' : 'Agregar Conductor'}</DialogTitle>
          <DialogDescription>
            {driver
              ? 'Modifique los detalles del conductor.'
              : 'Ingrese los detalles del nuevo conductor.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="fleet_id">ID Flota</Label>
            <Controller
              name="fleet_id"
              control={control}
              render={({ field }) => (
                <Input id="fleet_id" {...field} placeholder="Ej: 12345" />
              )}
            />
            {errors.fleet_id && (
              <p className="text-sm text-red-500 mt-1">{errors.fleet_id.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="name">Nombre Completo</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input id="name" {...field} placeholder="Ej: Juan Pérez" />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Conductor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 