"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle, SimpleDialogDescription } from "@/components/ui/simple-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createOperationsForm } from "@/lib/features/forms";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    is_active: z.boolean().default(true),
});

interface OperationsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function OperationsFormDialog({ open, onOpenChange }: OperationsFormDialogProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            is_active: true,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const form = await createOperationsForm(values);
                toast({
                    title: "Formulario creado",
                    description: "El formulario ha sido creado exitosamente.",
                });
                onOpenChange(false);
                router.refresh();
                router.push(`/forms/config/${form.id}`);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al crear el formulario.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>Nuevo Formulario de Operaciones</SimpleDialogTitle>
                <SimpleDialogDescription>
                    Complete los campos para crear un nuevo formulario de operaciones
                </SimpleDialogDescription>
            </SimpleDialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input placeholder="Inspección de Vehículo" {...field} />
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
                                    <Textarea
                                        placeholder="Formulario para la inspección de vehículos..."
                                        {...field}
                                    />
                                </FormControl>
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
                                    <FormLabel>Estado</FormLabel>
                                    <FormDescription>
                                        Activar o desactivar el formulario
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            Crear Formulario
                        </Button>
                    </div>
                </form>
            </Form>
        </SimpleDialog>
    );
} 