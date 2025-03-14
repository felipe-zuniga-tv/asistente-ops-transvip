"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { Button,
    SimpleDialog,
    SimpleDialogHeader,
    SimpleDialogFooter,
    SimpleDialogTitle,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Textarea,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getVehicleStatusConfigs, createVehicleStatus, updateVehicleStatus } from "@/lib/services/database/actions";
import type { VehicleStatus } from "@/lib/core/types";
import { getSession } from "@/lib/core/auth";

interface StatusConfig {
    id: string;
    label: string;
    color: string;
}

const formSchema = z.object({
    vehicle_number: z.string().min(1, "El número de móvil es requerido"),
    status_id: z.string().min(1, "El estado es requerido"),
    start_date: z.date({
        required_error: "La fecha de inicio es requerida",
    }),
    end_date: z.date({
        required_error: "La fecha de fin es requerida",
    }),
    comments: z.string().optional(),
}).refine((data) => data.end_date >= data.start_date, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["end_date"],
});

interface StatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    statusToEdit?: VehicleStatus;
    statusConfigs: StatusConfig[];
}

const emptyStatus = {
    vehicle_number: "",
    status_id: "",
    start_date: new Date(),
    end_date: new Date(),
    comments: "",
}

export function StatusDialog({
    open,
    onOpenChange,
    statusToEdit,
    statusConfigs
}: StatusDialogProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isFormInitialized, setIsFormInitialized] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicle_number: "",
            status_id: "",
            start_date: new Date(),
            end_date: new Date(),
            comments: "",
        },
    });

    useEffect(() => {
        if (open) {
            setIsFormInitialized(false);
            
            if (statusToEdit) {                
                setTimeout(() => {
                    form.setValue("vehicle_number", statusToEdit.vehicle_number.toString());
                    form.setValue("status_id", statusToEdit.status_id);
                    form.setValue("start_date", parseISO(statusToEdit.start_date));
                    form.setValue("end_date", parseISO(statusToEdit.end_date));
                    form.setValue("comments", statusToEdit.comments || "");
                    setIsFormInitialized(true);
                }, 0);
            } else {
                form.reset(emptyStatus);
                setIsFormInitialized(true);
            }
        }
    }, [open, statusToEdit, form]);

    useEffect(() => {
        if (open && statusToEdit) {
            const currentStatus = form.getValues("status_id");
        }
    }, [open, statusToEdit, form, isFormInitialized]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            
            const session = await getSession();
            const userEmail = session ? (session as any).user?.email : null;
            
            const data = {
                vehicle_number: values.vehicle_number,
                status_id: values.status_id,
                start_date: format(values.start_date, 'yyyy-MM-dd'),
                end_date: format(values.end_date, 'yyyy-MM-dd'),
                comments: values.comments,
            };

            if (statusToEdit) {
                await updateVehicleStatus(statusToEdit.id, {
                    ...data,
                    updated_by: userEmail
                });
                toast.success("Estado actualizado exitosamente");
            } else {
                await createVehicleStatus({
                    ...data,
                    created_by: userEmail,
                    is_active: true
                });
                toast.success("Estado registrado exitosamente");
            }
            
            onOpenChange(false);
            form.reset();
            router.refresh();
        } catch (error) {
            console.error("Error saving status:", error);
            toast.error(statusToEdit ? "Error al actualizar el estado" : "Error al registrar el estado");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SimpleDialog isOpen={open} onClose={() => onOpenChange(false)}>
            <SimpleDialogHeader>
                <SimpleDialogTitle>{statusToEdit ? "Editar" : "Registrar"} Estado de Móvil</SimpleDialogTitle>
            </SimpleDialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="vehicle_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Móvil</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ejemplo: 4321" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status_id"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Estado</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        value={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un estado" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {statusConfigs.map((config) => (
                                                <SelectItem key={config.id} value={config.id}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: config.color }}
                                                        />
                                                        <span>{config.label}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Inicio</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                            onChange={e => {
                                                const date = new Date(e.target.value + 'T12:00:00');
                                                field.onChange(date);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fecha Fin</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            {...field}
                                            value={field.value ? format(field.value, 'yyyy-MM-dd') : ''}
                                            onChange={e => {
                                                const date = new Date(e.target.value + 'T12:00:00');
                                                field.onChange(date);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="comments"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Comentarios</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Ingrese comentarios adicionales..."
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <SimpleDialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Guardando..." : (statusToEdit ? "Actualizar" : "Guardar")}
                        </Button>
                    </SimpleDialogFooter>
                </form>
            </Form>
        </SimpleDialog>
    );
}