"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle, SimpleDialogDescription } from "@/components/ui/simple-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { addEmailGroup } from "@/lib/features/access-control"

const formSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional(),
})

interface CreateGroupDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onGroupCreated: (newGroup: any) => void
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const newGroup = await addEmailGroup(values.name, values.description)
            onGroupCreated(newGroup)
            form.reset()
            onOpenChange(false)
            toast.success("Grupo creado exitosamente")
        } catch (error) {
            toast.error("Error al crear el grupo")
        }
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>Crear Nuevo Grupo</SimpleDialogTitle>
                <SimpleDialogDescription>
                    Crea un nuevo grupo de usuarios para asignar permisos.
                </SimpleDialogDescription>
            </SimpleDialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Grupo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Administradores" {...field} />
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
                                    <Input placeholder="Descripción del grupo..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button type="submit">Crear Grupo</Button>
                    </div>
                </form>
            </Form>
        </SimpleDialog>
    )
} 