'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { createBranch, updateBranch } from '@/lib/features/admin'
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from '@/components/ui/simple-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Branch, CreateBranchInput } from '@/types/domain/admin/types'

interface BranchDialogProps {
    branch?: Branch | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: (branch: Branch) => void
}

export function BranchDialog({
    branch,
    open,
    onOpenChange,
    onSuccess,
}: BranchDialogProps) {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<CreateBranchInput>({
        name: '',
        code: '',
        branch_id: 0,
        sales_form_active: false,
        is_active: true,
    })

    const isEditMode = !!branch

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                code: branch.code,
                branch_id: branch.branch_id,
                sales_form_active: branch.sales_form_active,
                is_active: branch.is_active,
            })
        } else {
            setFormData({
                name: '',
                code: '',
                branch_id: 0,
                sales_form_active: false,
                is_active: true,
            })
        }
    }, [branch])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            if (isEditMode && branch && branch.id) {
                const updatedBranch = await updateBranch(branch.id, formData)
                toast({
                    title: 'Éxito',
                    description: 'Sucursal actualizada exitosamente',
                })
                onSuccess({ ...updatedBranch, id: branch.id })
            } else {
                const newBranch = await createBranch(formData)
                toast({
                    title: 'Éxito',
                    description: 'Sucursal creada exitosamente',
                })
                onSuccess(newBranch)
            }
            router.refresh()
            onOpenChange(false)
        } catch (error) {
            console.error('Error saving branch:', error)
            toast({
                title: 'Error',
                description: `Error al ${isEditMode ? 'actualizar' : 'crear'} la sucursal`,
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <SimpleDialog 
            isOpen={open} 
            onClose={() => onOpenChange(false)}
        >
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {isEditMode ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
                        maxLength={3}
                        onChange={(e) =>
                            setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="branch_id">ID de Sucursal (Enlace)</Label>
                    <Input
                        id="branch_id"
                        type="number"
                        value={formData.branch_id}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                branch_id: parseInt(e.target.value, 10),
                            })
                        }
                        required
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="sales_form_active"
                        checked={formData.sales_form_active}
                        onCheckedChange={(checked) =>
                            setFormData({ ...formData, sales_form_active: checked })
                        }
                        className="data-[state=checked]:bg-green-400"
                    />
                    <Label htmlFor="sales_form_active">Formulario de Ventas Activo</Label>
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
