"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createSection, updateSection } from "@/lib/services/forms";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { OperationsFormSection } from "@/lib/types/vehicle/forms";

const formSchema = z.object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    order: z.number().min(0),
});

interface OperationsFormSectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formId: string;
    section?: OperationsFormSection;
    currentOrder?: number;
}

export function OperationsFormSectionDialog({ 
    open, 
    onOpenChange, 
    formId, 
    section,
    currentOrder = 0 
}: OperationsFormSectionDialogProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: section?.title ?? "",
            description: section?.description ?? "",
            order: section?.order ?? currentOrder,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                if (section) {
                    await updateSection(section.id, values);
                    toast({
                        title: "Sección actualizada",
                        description: "La sección ha sido actualizada exitosamente.",
                    });
                } else {
                    await createSection({
                        ...values,
                        form_id: formId,
                    });
                    toast({
                        title: "Sección creada",
                        description: "La sección ha sido creada exitosamente.",
                    });
                }
                onOpenChange(false);
                router.refresh();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al guardar la sección.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {section ? "Editar Sección" : "Nueva Sección"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Título</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Sección de Inspección" {...field} />
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
                                            placeholder="Descripción de la sección..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="order"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Orden</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={0}
                                            {...field}
                                            onChange={e => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {section ? "Actualizar" : "Crear"} Sección
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 