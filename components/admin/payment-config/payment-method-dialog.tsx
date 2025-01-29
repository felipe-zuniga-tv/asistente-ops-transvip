'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { type PaymentMethod, type CreatePaymentMethodInput } from '@/lib/types/admin'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { icons } from '@/components/ui/icons-list'

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
})

type FormValues = z.infer<typeof formSchema>

interface PaymentMethodDialogProps {
    method?: PaymentMethod | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function PaymentMethodDialog({
    method,
    open,
    onOpenChange,
    onSuccess,
}: PaymentMethodDialogProps) {
    const [isLoading, setIsLoading] = useState(false)
    const isEditMode = !!method

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            code: '',
            icon_name: '',
            is_active: true,
        },
    })

    useEffect(() => {
        if (method) {
            form.reset({
                name: method.name,
                code: method.code,
                icon_name: method.icon_name,
                is_active: method.is_active,
            })
        } else {
            form.reset({
                name: '',
                code: '',
                icon_name: '',
                is_active: true,
            })
        }
    }, [form, method])

    // Watch the name field to update code
    const name = form.watch('name')

    // Update code when name changes
    useEffect(() => {
        const code = name
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .replace(/[^A-Z0-9_]/g, '') // Remove any character that's not uppercase letter, number or underscore
        form.setValue('code', code)
    }, [name, form])

    async function onSubmit(values: FormValues) {
        setIsLoading(true)
        try {
            if (isEditMode && method) {
                // TODO: Implement API call to update payment method
                console.log('Updating payment method:', method.id, values)
            } else {
                // TODO: Implement API call to create payment method
                const paymentMethodInput: CreatePaymentMethodInput = values
                console.log('Creating payment method:', paymentMethodInput)
            }
            onSuccess()
            if (!isEditMode) {
                form.reset()
            }
            onOpenChange(false)
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} payment method:`, error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode 
                            ? 'Modifica los detalles del método de pago.'
                            : 'Crea un nuevo método de pago para el sistema.'}
                    </DialogDescription>
                </DialogHeader>
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
                                            disabled
                                            className="bg-muted"
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
                                    <FormLabel>Ícono</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un ícono" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {icons.map((icon) => {
                                                const Icon = icon.icon
                                                return (
                                                    <SelectItem
                                                        key={icon.value}
                                                        value={icon.value}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Icon className="h-4 w-4" />
                                                            <span>{icon.label}</span>
                                                        </div>
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <FormControl>
                                        <div className="w-full flex flex-row items-center justify-start gap-2">
                                            <span className="text-sm font-medium">Activo</span>
                                            <Switch
                                                className="mt-0 data-[state=checked]:!bg-green-500"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading
                                    ? isEditMode
                                        ? 'Guardando...'
                                        : 'Creando...'
                                    : isEditMode
                                    ? 'Guardar cambios'
                                    : 'Crear'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
} 