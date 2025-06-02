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
  branch_name: z.string().optional(),
  driver_category: z.string().optional(),
  employment_status: z.string().optional(),
  digital_folder_url: z.string().url({ message: "Por favor ingrese una URL válida." }).optional().or(z.literal('')),
  national_id_number: z.string().min(1, "El RUN es requerido."),
  national_id_dv: z.string().length(1, "El DV debe tener 1 caracter."),
  phone_contact: z.string().optional(),
  email_contact: z.string().email({ message: "Por favor ingrese un correo válido." }).optional().or(z.literal('')),
  employer_rut: z.string().optional(),
  employer_name: z.string().optional(),
  national_id_card_expiry_date: z.string().optional(), // Consider using z.date() if input type="date" provides Date object
  occupational_exam_expiry_date: z.string().optional(),
  psychotechnical_exam_expiry_date: z.string().optional(),
  risk_aversion_test_expiry_date: z.string().optional(),
  driving_license_expiry_date: z.string().optional(),
  defensive_driving_course_expiry_date: z.string().optional(),
  new_hire_induction_expiry_date: z.string().optional(),
  dch_odi_expiry_date: z.string().optional(),
  drt_plant_driving_expiry_date: z.string().optional(),
  dmh_plant_driving_expiry_date: z.string().optional(),
  dgm_driving_qualification_expiry_date: z.string().optional(),
  overall_accreditation_status: z.string().optional(),
  notes: z.string().optional(),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

interface ConductoresDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: DriverFormValues, id?: string) => Promise<void>;
  driver: Driver | null;
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
      branch_name: '',
      driver_category: '',
      employment_status: '',
      digital_folder_url: '',
      national_id_number: '',
      national_id_dv: '',
      phone_contact: '',
      email_contact: '',
      employer_rut: '',
      employer_name: '',
      national_id_card_expiry_date: '',
      occupational_exam_expiry_date: '',
      psychotechnical_exam_expiry_date: '',
      risk_aversion_test_expiry_date: '',
      driving_license_expiry_date: '',
      defensive_driving_course_expiry_date: '',
      new_hire_induction_expiry_date: '',
      dch_odi_expiry_date: '',
      drt_plant_driving_expiry_date: '',
      dmh_plant_driving_expiry_date: '',
      dgm_driving_qualification_expiry_date: '',
      overall_accreditation_status: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (driver) {
      reset({
        fleet_id: driver.fleet_id,
        name: driver.name,
        branch_name: driver.branch_name || '',
        driver_category: driver.driver_category || '',
        employment_status: driver.employment_status || '',
        digital_folder_url: driver.digital_folder_url || '',
        national_id_number: driver.national_id_number,
        national_id_dv: driver.national_id_dv,
        phone_contact: driver.phone_contact || '',
        email_contact: driver.email_contact || '',
        employer_rut: driver.employer_rut || '',
        employer_name: driver.employer_name || '',
        national_id_card_expiry_date: driver.national_id_card_expiry_date ? new Date(driver.national_id_card_expiry_date).toISOString().split('T')[0] : '',
        occupational_exam_expiry_date: driver.occupational_exam_expiry_date ? new Date(driver.occupational_exam_expiry_date).toISOString().split('T')[0] : '',
        psychotechnical_exam_expiry_date: driver.psychotechnical_exam_expiry_date ? new Date(driver.psychotechnical_exam_expiry_date).toISOString().split('T')[0] : '',
        risk_aversion_test_expiry_date: driver.risk_aversion_test_expiry_date ? new Date(driver.risk_aversion_test_expiry_date).toISOString().split('T')[0] : '',
        driving_license_expiry_date: driver.driving_license_expiry_date ? new Date(driver.driving_license_expiry_date).toISOString().split('T')[0] : '',
        defensive_driving_course_expiry_date: driver.defensive_driving_course_expiry_date ? new Date(driver.defensive_driving_course_expiry_date).toISOString().split('T')[0] : '',
        new_hire_induction_expiry_date: driver.new_hire_induction_expiry_date ? new Date(driver.new_hire_induction_expiry_date).toISOString().split('T')[0] : '',
        dch_odi_expiry_date: driver.dch_odi_expiry_date ? new Date(driver.dch_odi_expiry_date).toISOString().split('T')[0] : '',
        drt_plant_driving_expiry_date: driver.drt_plant_driving_expiry_date ? new Date(driver.drt_plant_driving_expiry_date).toISOString().split('T')[0] : '',
        dmh_plant_driving_expiry_date: driver.dmh_plant_driving_expiry_date ? new Date(driver.dmh_plant_driving_expiry_date).toISOString().split('T')[0] : '',
        dgm_driving_qualification_expiry_date: driver.dgm_driving_qualification_expiry_date ? new Date(driver.dgm_driving_qualification_expiry_date).toISOString().split('T')[0] : '',
        overall_accreditation_status: driver.overall_accreditation_status || '',
        notes: driver.notes || '',
      });
    } else {
      reset({
        fleet_id: '', name: '', branch_name: '', driver_category: '', employment_status: '',
        digital_folder_url: '', national_id_number: '', national_id_dv: '', phone_contact: '',
        email_contact: '', employer_rut: '', employer_name: '', national_id_card_expiry_date: '',
        occupational_exam_expiry_date: '', psychotechnical_exam_expiry_date: '', risk_aversion_test_expiry_date: '',
        driving_license_expiry_date: '', defensive_driving_course_expiry_date: '', new_hire_induction_expiry_date: '',
        dch_odi_expiry_date: '', drt_plant_driving_expiry_date: '', dmh_plant_driving_expiry_date: '',
        dgm_driving_qualification_expiry_date: '', overall_accreditation_status: '', notes: ''
      });
    }
  }, [driver, reset, isOpen]); // Depend on isOpen to reset form when dialog opens

  const onSubmit = async (data: DriverFormValues) => {
    const dataToSave = {
      ...data,
      national_id_card_expiry_date: data.national_id_card_expiry_date ? new Date(data.national_id_card_expiry_date).toISOString() : undefined,
      occupational_exam_expiry_date: data.occupational_exam_expiry_date ? new Date(data.occupational_exam_expiry_date).toISOString() : undefined,
      psychotechnical_exam_expiry_date: data.psychotechnical_exam_expiry_date ? new Date(data.psychotechnical_exam_expiry_date).toISOString() : undefined,
      risk_aversion_test_expiry_date: data.risk_aversion_test_expiry_date ? new Date(data.risk_aversion_test_expiry_date).toISOString() : undefined,
      driving_license_expiry_date: data.driving_license_expiry_date ? new Date(data.driving_license_expiry_date).toISOString() : undefined,
      defensive_driving_course_expiry_date: data.defensive_driving_course_expiry_date ? new Date(data.defensive_driving_course_expiry_date).toISOString() : undefined,
      new_hire_induction_expiry_date: data.new_hire_induction_expiry_date ? new Date(data.new_hire_induction_expiry_date).toISOString() : undefined,
      dch_odi_expiry_date: data.dch_odi_expiry_date ? new Date(data.dch_odi_expiry_date).toISOString() : undefined,
      drt_plant_driving_expiry_date: data.drt_plant_driving_expiry_date ? new Date(data.drt_plant_driving_expiry_date).toISOString() : undefined,
      dmh_plant_driving_expiry_date: data.dmh_plant_driving_expiry_date ? new Date(data.dmh_plant_driving_expiry_date).toISOString() : undefined,
      dgm_driving_qualification_expiry_date: data.dgm_driving_qualification_expiry_date ? new Date(data.dgm_driving_qualification_expiry_date).toISOString() : undefined,
    };
    await onSave(dataToSave, driver?.id);
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="national_id_number">RUN</Label>
              <Controller
                name="national_id_number"
                control={control}
                render={({ field }) => (
                  <Input id="national_id_number" {...field} placeholder="Ej: 12345678" />
                )}
              />
              {errors.national_id_number && (
                <p className="text-sm text-red-500 mt-1">{errors.national_id_number.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="national_id_dv">DV</Label>
              <Controller
                name="national_id_dv"
                control={control}
                render={({ field }) => (
                  <Input id="national_id_dv" {...field} placeholder="Ej: K" maxLength={1} />
                )}
              />
              {errors.national_id_dv && (
                <p className="text-sm text-red-500 mt-1">{errors.national_id_dv.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="branch_name">Sucursal</Label>
            <Controller
              name="branch_name"
              control={control}
              render={({ field }) => (
                <Input id="branch_name" {...field} placeholder="Ej: Calama" />
              )}
            />
            {errors.branch_name && (
              <p className="text-sm text-red-500 mt-1">{errors.branch_name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone_contact">Teléfono Contacto</Label>
            <Controller
              name="phone_contact"
              control={control}
              render={({ field }) => (
                <Input id="phone_contact" {...field} placeholder="Ej: +56912345678" />
              )}
            />
            {errors.phone_contact && (
              <p className="text-sm text-red-500 mt-1">{errors.phone_contact.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email_contact">Email Contacto</Label>
            <Controller
              name="email_contact"
              control={control}
              render={({ field }) => (
                <Input id="email_contact" type="email" {...field} placeholder="Ej: conductor@example.com" />
              )}
            />
            {errors.email_contact && (
              <p className="text-sm text-red-500 mt-1">{errors.email_contact.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="national_id_card_expiry_date">Vencimiento C.I.</Label>
              <Controller
                name="national_id_card_expiry_date"
                control={control}
                render={({ field }) => (
                  <Input id="national_id_card_expiry_date" type="date" {...field} />
                )}
              />
              {errors.national_id_card_expiry_date && (
                <p className="text-sm text-red-500 mt-1">{errors.national_id_card_expiry_date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="driving_license_expiry_date">Vencimiento Licencia Conducir</Label>
              <Controller
                name="driving_license_expiry_date"
                control={control}
                render={({ field }) => (
                  <Input id="driving_license_expiry_date" type="date" {...field} />
                )}
              />
              {errors.driving_license_expiry_date && (
                <p className="text-sm text-red-500 mt-1">{errors.driving_license_expiry_date.message}</p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Observaciones</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Input id="notes" {...field} placeholder="Alguna observación relevante..." />
              )}
            />
            {errors.notes && (
              <p className="text-sm text-red-500 mt-1">{errors.notes.message}</p>
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