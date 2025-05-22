'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useToast } from '@/hooks/use-toast'
import { Button, Input, Label, Switch } from '@/components/ui'
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from '@/components/ui/simple-dialog'
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleType, updateVehicleType } from '@/lib/features/admin'
import type { VehicleType, CreateVehicleTypeInput } from '@/types/domain/admin/types'

interface VehicleTypeDialogProps {
    vehicleType?: VehicleType | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function VehicleTypeDialog({
    vehicleType,
    open,
    onOpenChange,
}: VehicleTypeDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditMode = !!vehicleType

    const [formData, setFormData] = useState<CreateVehicleTypeInput>({
        name: '',
        code: '',
        passenger_capacity: 0,
        luggage_capacity: 0,
        is_active: true,
    })

    useEffect(() => {
        if (vehicleType) {
            setFormData({
                name: vehicleType.name,
                code: vehicleType.code,
                passenger_capacity: vehicleType.passenger_capacity,
                luggage_capacity: vehicleType.luggage_capacity,
                is_active: vehicleType.is_active,
            })
        } else {
            setFormData({
                name: '',
                code: '',
                passenger_capacity: 0,
                luggage_capacity: 0,
                is_active: true,
            })
        }
    }, [vehicleType])

    const handleSubmit = async (dataFromHookForm: CreateVehicleTypeInput) => {
        setIsSubmitting(true)

        const payload: CreateVehicleTypeInput = {
            ...dataFromHookForm,
            is_active: formData.is_active,
        };

        try {
            if (isEditMode && vehicleType) {
                await updateVehicleType(vehicleType.id, payload)
                toast({
                    title: 'Éxito',
                    description: 'Tipo de vehículo actualizado exitosamente',
                })
            } else {
                await createVehicleType(payload)
                toast({
                    title: 'Éxito',
                    description: 'Tipo de vehículo creado exitosamente',
                })
            }
            onOpenChange(false)
            setTimeout(() => {
                router.refresh()
            }, 500)
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} vehicle type:`, error)
            toast({
                title: 'Error',
                description: `Error al ${isEditMode ? 'actualizar' : 'crear'} el tipo de vehículo`,
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formSchema = z.object({
        name: z.string().min(1, 'El nombre es requerido'),
        code: z.string().min(1, 'El código es requerido'),
        passenger_capacity: z.number().min(1, 'La capacidad de pasajeros es requerida'),
        luggage_capacity: z.number().min(1, 'La capacidad de maletas es requerida'),
        is_active: z.boolean(),
    });

    const {
        register,
        handleSubmit: hookFormHandleSubmit,
        formState: { errors },
    } = useForm<CreateVehicleTypeInput>({
        resolver: zodResolver(formSchema),
        defaultValues: formData,
    });

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {isEditMode ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}
                </SimpleDialogTitle>
            </SimpleDialogHeader>
            <form onSubmit={hookFormHandleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        {...register('name')}
                        required
                    />
                    {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                        id="code"
                        {...register('code')}
                        required
                    />
                    {errors.code && <span className="text-red-500">{errors.code.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="passenger_capacity">Capacidad de Pasajeros</Label>
                    <Input
                        id="passenger_capacity"
                        type="number"
                        {...register('passenger_capacity')}
                        required
                    />
                    {errors.passenger_capacity && <span className="text-red-500">{errors.passenger_capacity.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="luggage_capacity">Capacidad de Maletas</Label>
                    <Input
                        id="luggage_capacity"
                        type="number"
                        {...register('luggage_capacity')}
                        required
                    />
                    {errors.luggage_capacity && <span className="text-red-500">{errors.luggage_capacity.message}</span>}
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, is_active: checked })
                        }
                        className="data-[state=checked]:bg-green-400"
                    />
                    <Label htmlFor="is_active">Activo</Label>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? isEditMode
                                ? 'Guardando...'
                                : 'Creando...'
                            : isEditMode
                            ? 'Guardar'
                            : 'Crear'}
                    </Button>
                </div>
            </form>
        </SimpleDialog>
    )
} 