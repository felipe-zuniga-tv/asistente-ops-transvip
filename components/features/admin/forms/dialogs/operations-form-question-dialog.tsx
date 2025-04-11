"use client";

import { useTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle } from "@/components/ui/simple-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { OperationsFormQuestion, QuestionType, QUESTION_TYPE_CONFIG } from "@/lib/core/types/vehicle/forms";
import { createQuestion, updateQuestion } from "@/lib/services/forms";
import { Plus, Trash2 } from "lucide-react";

const QUESTION_TYPES = Object.entries(QUESTION_TYPE_CONFIG).map(([value, config]) => ({
    value: value as QuestionType,
    label: config.label,
}));

const optionSchema = z.object({
    label: z.string().min(1, "La etiqueta es requerida"),
    order: z.number(),
});

const formSchema = z.object({
    label: z.string().min(1, "La etiqueta es requerida"),
    type: z.enum(["text", "number", "image", "email", "options"] as const),
    order: z.number().min(0),
    is_active: z.boolean().default(true),
    is_required: z.boolean().default(true),
    allow_gallery_access: z.boolean().optional(),
    options: z.array(optionSchema).optional(),
});

interface OperationsFormQuestionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sectionId: string;
    question?: OperationsFormQuestion;
    currentOrder?: number;
    onQuestionUpdate?: (question: OperationsFormQuestion) => void;
}

export function OperationsFormQuestionDialog({
    open,
    onOpenChange,
    sectionId,
    question,
    currentOrder = 0,
    onQuestionUpdate,
}: OperationsFormQuestionDialogProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();
    const [options, setOptions] = useState<{ label: string; order: number; }[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: "",
            type: "text",
            order: currentOrder,
            is_active: true,
            is_required: true,
            allow_gallery_access: false,
            options: [],
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                label: question?.label ?? "",
                type: question?.type ?? "text",
                order: question?.order ?? currentOrder,
                is_active: question?.is_active ?? true,
                is_required: question?.is_required ?? true,
                allow_gallery_access: question?.allow_gallery_access ?? false,
                options: question?.options?.map(opt => ({ label: opt.label, order: opt.order })) ?? [],
            });
            setOptions(question?.options?.map(opt => ({ label: opt.label, order: opt.order })) ?? []);
        }
    }, [open, question, currentOrder, form]);

    const questionType = form.watch("type");

    const addOption = () => {
        const newOption = {
            label: "",
            order: options.length,
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        newOptions.forEach((opt, idx) => {
            opt.order = idx;
        });
        setOptions(newOptions);
    };

    const updateOptionLabel = (index: number, label: string) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], label };
        setOptions(newOptions);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            try {
                const submitData = {
                    ...values,
                    options: questionType === 'options' 
                        ? options.map((opt, index) => ({
                            ...opt,
                            order: index + 1
                        }))
                        : undefined,
                };

                if (question) {
                    const updatedQuestion = await updateQuestion(question.id, submitData);
                    toast({
                        title: "Pregunta actualizada",
                        description: "La pregunta ha sido actualizada exitosamente.",
                    });
                    onQuestionUpdate?.(updatedQuestion);
                } else {
                    await createQuestion({
                        ...submitData,
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
        <SimpleDialog
            isOpen={open}
            onClose={() => onOpenChange(false)}
            className="sm:max-w-[600px]"
        >
            <SimpleDialogHeader>
                <SimpleDialogTitle>
                    {question ? "Editar Pregunta" : "Nueva Pregunta"}
                </SimpleDialogTitle>
            </SimpleDialogHeader>

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

                    {questionType === 'options' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Opciones</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addOption}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Opción
                                </Button>
                            </div>
                            { options.length > 0 && 
                                <div className="space-y-2 p-2 rounded-md bg-muted">
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <Input
                                                placeholder="Ingresa la opción..."
                                                value={option.label}
                                                onChange={(e) => updateOptionLabel(index, e.target.value)}
                                                className="bg-white text-black"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeOption(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    )}

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

                    <FormField
                        control={form.control}
                        name="is_required"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Obligatoria</FormLabel>
                                    <FormDescription>
                                        Marcar la pregunta como obligatoria
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
        </SimpleDialog>
    );
} 