"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle, SimpleDialogDescription } from "@/components/ui/simple-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { updateEmailGroup } from "@/lib/services/access-control"

const formSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
})

interface EditGroupDialogProps {
    group: {
        id: string
        name: string
        description?: string
    } | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onGroupUpdated: (updatedGroup: any) => void
}

export function EditGroupDialog({ group, open, onOpenChange, onGroupUpdated }: EditGroupDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: group?.name || "",
            description: group?.description || "",
        },
    })

    // Reset form when group changes
    React.useEffect(() => {
        if (group) {
            form.reset({
                name: group.name,
                description: group.description || "",
            })
        }
    }, [group, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!group) return

        try {
            const updatedGroup = await updateEmailGroup(group.id, values.name, values.description)
            onGroupUpdated(updatedGroup)
            onOpenChange(false)
            toast.success("Grupo actualizado exitosamente")
        } catch (error) {
            toast.error("Error al actualizar el grupo")
        }
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>Editar Grupo</SimpleDialogTitle>
                <SimpleDialogDescription>
                    Modifica los detalles del grupo
                </SimpleDialogDescription>
            </SimpleDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nombre del grupo" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descripción</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Descripción del grupo" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </Form>
        </SimpleDialog>
    )
} 