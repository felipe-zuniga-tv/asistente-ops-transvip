"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { InspectionQuestion, QuestionType } from "@/lib/types/vehicle/inspection";
import { createQuestion, updateQuestion } from "@/lib/services/vehicle/inspection-forms";

const QUESTION_TYPES: { label: string; value: QuestionType }[] = [
    { label: "Texto", value: "text" },
    { label: "Número", value: "number" },
    { label: "Imagen", value: "image" },
    { label: "Correo", value: "email" },
];

const formSchema = z.object({
    label: z.string().min(1, "La etiqueta es requerida"),
    type: z.enum(["text", "number", "image", "email"] as const),
    order: z.number().min(0),
    is_active: z.boolean().default(true),
    allow_gallery_access: z.boolean().optional(),
});

interface InspectionQuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionId: string;
    question?: InspectionQuestion;
    currentOrder?: number;
}

export function InspectionQuestionDialog({
    open,
    onOpenChange,
    sectionId,
    question,
    currentOrder = 0,
}: InspectionQuestionDialogProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: question?.label ?? "",
            type: question?.type ?? "text",
            order: question?.order ?? currentOrder,
            is_active: question?.is_active ?? true,
            allow_gallery_access: question?.allow_gallery_access ?? false,
        },
    });

    const questionType = form.watch("type");

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                if (question) {
                    await updateQuestion(question.id, values);
                    toast({
                        title: "Pregunta actualizada",
                        description: "La pregunta ha sido actualizada exitosamente.",
                    });
                } else {
                    await createQuestion({
                        ...values,
                        section_id: sectionId,
                    });
                    toast({
                        title: "Pregunta creada",
                        description: "La pregunta ha sido creada exitosamente.",
                    });
                }
                onOpenChange(false);
                router.refresh();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Ha ocurrido un error al guardar la pregunta.",
                    variant: "destructive",
                });
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby="dialog-description">
                <DialogHeader>
                    <DialogTitle>
                        {question ? "Editar Pregunta" : "Nueva Pregunta"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Etiqueta</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ingresa tus datos..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Pregunta</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {QUESTION_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Estado</FormLabel>
                                        <FormDescription>
                                            Activar o desactivar la pregunta
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

                        {questionType === "image" && (
                            <FormField
                                control={form.control}
                                name="allow_gallery_access"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>Acceso a Galería</FormLabel>
                                            <FormDescription>
                                                Permitir acceso a la galería del dispositivo
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
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {question ? "Actualizar" : "Crear"} Pregunta
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 