"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateVehicleStatusConfig } from "@/lib/database/actions";
import type { VehicleStatusConfig } from "@/lib/types/vehicle/status";

interface EditStatusConfigDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    config: VehicleStatusConfig;
}

const formSchema = z.object({
    label: z.string().min(1, "El nombre del estado es requerido"),
    description: z.string().optional(),
    color: z.string().min(1, "El color es requerido").regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Color inválido"),
});

export function EditStatusConfigDialog({
    open,
    onOpenChange,
    config,
}: EditStatusConfigDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: config.label,
            description: config.description || "",
            color: config.color,
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                label: config.label,
                description: config.description || "",
                color: config.color,
            });
        }
    }, [open, config, form]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            
            await updateVehicleStatusConfig(config.id, values);
            
            onOpenChange(false);
            form.reset();
            setTimeout(() => {
                router.refresh();
            }, 500);
            toast.success("Estado actualizado exitosamente");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Error al actualizar el estado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Estado</DialogTitle>
                    <DialogDescription>
                        Modifique los datos del estado
                    </DialogDescription>
                </DialogHeader>
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

                        <DialogFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Actualizando..." : "Actualizar Estado"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 