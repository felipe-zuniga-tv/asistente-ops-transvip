'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { createVehicleType, updateVehicleType } from '@/lib/services/admin'
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from '@/components/ui/simple-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { VehicleType, CreateVehicleTypeInput } from '@/lib/types/admin'

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (isEditMode && vehicleType) {
                await updateVehicleType(vehicleType.id, formData)
                toast({
                    title: 'Éxito',
                    description: 'Tipo de vehículo actualizado exitosamente',
                })
            } else {
                await createVehicleType(formData)
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

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {isEditMode ? 'Editar Tipo de Vehículo' : 'Nuevo Tipo de Vehículo'}
                </SimpleDialogTitle>
            </SimpleDialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="code">Código</Label>
                    <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) =>
                            setFormData({ ...formData, code: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="passenger_capacity">Capacidad de Pasajeros</Label>
                    <Input
                        id="passenger_capacity"
                        type="number"
                        value={formData.passenger_capacity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                passenger_capacity: parseInt(e.target.value, 10),
                            })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="luggage_capacity">Capacidad de Maletas</Label>
                    <Input
                        id="luggage_capacity"
                        type="number"
                        value={formData.luggage_capacity}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                luggage_capacity: parseInt(e.target.value, 10),
                            })
                        }
                        required
                    />
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