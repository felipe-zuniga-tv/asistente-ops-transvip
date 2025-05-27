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

import type { Vehicle } from '@/types/domain/seguridad/types';

const vehicleFormSchema = z.object({
  vehicle_number: z.string().min(1, 'El Nº de móvil es requerido.'),
  make_model: z.string().optional(), // Make/model can be optional
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface MovilesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: Pick<Vehicle, 'vehicle_number' | 'make_model'>, id?: string) => Promise<void>;
  vehicle: Pick<Vehicle, 'id' | 'vehicle_number' | 'make_model'> | null;
}

export function MovilesDialog({
  isOpen,
  onClose,
  onSave,
  vehicle,
}: MovilesDialogProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vehicle_number: '',
      make_model: '',
    },
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        vehicle_number: vehicle.vehicle_number,
        make_model: vehicle.make_model || '',
      });
    } else {
      reset({ vehicle_number: '', make_model: '' });
    }
  }, [vehicle, reset, isOpen]);

  const onSubmit = async (data: VehicleFormValues) => {
    await onSave(data, vehicle?.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Editar Móvil' : 'Agregar Móvil'}</DialogTitle>
          <DialogDescription>
            {vehicle
              ? 'Modifique los detalles del móvil.'
              : 'Ingrese los detalles del nuevo móvil.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="vehicle_number">Nº Móvil / Patente</Label>
            <Controller
              name="vehicle_number"
              control={control}
              render={({ field }) => (
                <Input id="vehicle_number" {...field} placeholder="Ej: ABCD12" />
              )}
            />
            {errors.vehicle_number && (
              <p className="text-sm text-red-500 mt-1">{errors.vehicle_number.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="make_model">Marca / Modelo</Label>
            <Controller
              name="make_model"
              control={control}
              render={({ field }) => (
                <Input id="make_model" {...field} placeholder="Ej: Toyota Hilux" />
              )}
            />
            {errors.make_model && (
              <p className="text-sm text-red-500 mt-1">{errors.make_model.message}</p>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Móvil'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 