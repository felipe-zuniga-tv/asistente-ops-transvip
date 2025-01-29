'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { icons } from '@/components/ui/icons-list'
import { createPaymentMethod } from '@/lib/services/admin'

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

interface NewPaymentMethodDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NewPaymentMethodDialog({
    open,
    onOpenChange,
}: NewPaymentMethodDialogProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    // Reset form when dialog opens or closes
    useEffect(() => {
        form.reset({
            ...defaultValues,
            payment_id: Math.floor(Date.now() / 1000),
        })
    }, [open, form])

    // Watch the name field to update code
    const name = form.watch('name')

    // Update code when name changes
    useEffect(() => {
        const code = name
            .trim()
            .toUpperCase()
            .replace(/\s+/g, '_')
            .replace(/[^A-Z0-9_]/g, '')
        form.setValue('code', code)
    }, [name, form])

    async function onSubmit(values: FormValues) {
        try {
            setIsSubmitting(true)
            await createPaymentMethod(values)
            onOpenChange(false)
            router.refresh()
        } catch (error) {
            console.error('Error creating payment method:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleOpenChange(open: boolean) {
        form.reset({
            ...defaultValues,
            payment_id: Math.floor(Date.now() / 1000),
        })
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nuevo Método de Pago</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo método de pago para el sistema.
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
                                    <div className="space-y-0.5">
                                        <FormLabel>Activo</FormLabel>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-0.5 data-[state=checked]:bg-green-500"
                                        />
                                    </FormControl>
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
            </DialogContent>
        </Dialog>
    )
} 
