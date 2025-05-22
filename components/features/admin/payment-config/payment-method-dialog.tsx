'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { cn } from '@/utils/ui'
import { 
    Button,
    SimpleDialog,
    SimpleDialogHeader,
    SimpleDialogTitle,
    SimpleDialogDescription,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Switch,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui"
import { createPaymentMethod, updatePaymentMethod } from '@/lib/features/admin'
import { type PaymentMethod } from '@/types/domain/admin/types'
import { Label } from '@/components/ui/label'
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'El nombre debe tener al menos 2 caracteres.',
    }),
    code: z.string().min(2, {
        message: 'El código debe tener al menos 2 caracteres.',
    }),
    icon_name: z.string().min(2, {
        message: 'Debes seleccionar un ícono.',
    }),
    is_active: z.boolean().default(true),
    payment_id: z.number().default(() => Math.floor(Date.now() / 1000)),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: FormValues = {
    name: '',
    code: '',
    icon_name: '',
    is_active: true,
    payment_id: Math.floor(Date.now() / 1000),
}

interface PaymentMethodDialogProps {
    method?: PaymentMethod | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PaymentMethodDialog({
    method,
    open,
    onOpenChange,
}: PaymentMethodDialogProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isEditing = !!method

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    // Reset form when dialog opens or closes
    useEffect(() => {
        if (method) {
            form.reset({
                name: method.name,
                code: method.code,
                icon_name: method.icon_name,
                is_active: method.is_active,
                payment_id: method.payment_id,
            })
        } else {
            form.reset({
                ...defaultValues,
                payment_id: Math.floor(Date.now() / 1000),
            })
        }
    }, [open, method, form])

    // Watch the name field to update code
    const name = form.watch('name')

    // Update code when name changes (only in create mode)
    useEffect(() => {
        if (!isEditing) {
            const code = name
                .trim()
                .toUpperCase()
                .replace(/\s+/g, '_')
                .replace(/[^A-Z0-9_]/g, '')
            form.setValue('code', code)
        }
    }, [name, form, isEditing])

    async function onSubmit(values: FormValues) {
        try {
            setIsSubmitting(true)
            if (isEditing && method?.id) {
                await updatePaymentMethod(method.id, values)
            } else {
                await createPaymentMethod(values)
            }
            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'creating'} payment method:`, error)
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset(defaultValues)
        }
        onOpenChange(open)
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => handleOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                </SimpleDialogTitle>
                <SimpleDialogDescription>
                    {isEditing 
                        ? 'Modifica los detalles del método de pago.'
                        : 'Crea un nuevo método de pago para el sistema.'
                    }
                </SimpleDialogDescription>
            </SimpleDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Efectivo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Código</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="EFECTIVO" 
                                        {...field} 
                                        disabled={isEditing}
                                        className={cn("bg-muted", isEditing ? 'opacity-50' : '')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="icon_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Ícono (Lucide)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: CreditCard, Coins" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-green-400"
                                    />
                                </FormControl>
                                <Label style={{ marginTop: 0 }}>Activo</Label>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : "Guardar"}
                        </Button>
                    </div>
                </form>
            </Form>
        </SimpleDialog>
    )
} 
