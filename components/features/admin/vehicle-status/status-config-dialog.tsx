"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Button,
    Input,
    Textarea,
    SimpleDialog,
    SimpleDialogHeader,
    SimpleDialogFooter,
    SimpleDialogTitle,
    SimpleDialogDescription,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createVehicleStatusConfig, updateVehicleStatusConfig } from "@/lib/features/vehicle-status";
import type { VehicleStatusConfig } from "@/types/domain/vehicle/types";

interface StatusConfigDialogProps {
    config?: VehicleStatusConfig | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    label: z.string().min(1, "El nombre del estado es requerido"),
    description: z.string().optional(),
    color: z.string().min(1, "El color es requerido").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color inválido"),
});

type FormValues = z.infer<typeof formSchema>;

export function StatusConfigDialog({
    config,
    open,
    onOpenChange,
}: StatusConfigDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!config;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            description: "",
            color: "#000000",
        },
    });

    useEffect(() => {
        if (open) {
            if (config) {
                form.reset({
                    label: config.label,
                    description: config.description || "",
                    color: config.color,
                });
            } else {
                form.reset({
                    label: "",
                    description: "",
                    color: "#000000",
                });
            }
        }
    }, [open, config, form]);

    async function onSubmit(values: FormValues) {
        try {
            setIsLoading(true);
            
            if (isEditMode && config) {
                await updateVehicleStatusConfig(config.id, values);
                toast.success("Estado actualizado exitosamente");
            } else {
                await createVehicleStatusConfig(values);
                toast.success("Estado creado exitosamente");
            }
            
            onOpenChange(false);
            form.reset();
            setTimeout(() => {
                router.refresh();
            }, 500);
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} status:`, error);
            toast.error(`Error al ${isEditMode ? 'actualizar' : 'crear'} el estado`);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {isEditMode ? "Editar Estado" : "Crear Nuevo Estado"}
                </SimpleDialogTitle>
                <SimpleDialogDescription>
                    {isEditMode
                        ? "Modifique los datos del estado"
                        : "Ingrese los datos del nuevo estado"}
                </SimpleDialogDescription>
            </SimpleDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Estado</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: En Servicio" {...field} />
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
                                        placeholder="Descripción del estado..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <Input type="color" {...field} className="w-12 h-8 p-0" />
                                        <Input {...field} placeholder="#000000" className="flex-1" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SimpleDialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? isEditMode
                                    ? "Actualizando..."
                                    : "Creando..."
                                : isEditMode
                                ? "Actualizar Estado"
                                : "Crear Estado"}
                        </Button>
                    </SimpleDialogFooter>
                </form>
            </Form>
        </SimpleDialog>
    );
} 