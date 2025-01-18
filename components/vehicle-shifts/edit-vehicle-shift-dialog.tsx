"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addYears, format, startOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { updateVehicleShift } from "@/lib/shifts/actions"
import { VehicleShift } from "./vehicle-shifts"
import { formSchema } from "./new-vehicle-shift-dialog"
import { es } from "date-fns/locale"

interface EditVehicleShiftDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    assignment: VehicleShift | null
    shifts: {
        id: string
        name: string
    }[]
}

export function EditVehicleShiftDialog({
    open,
    onOpenChange,
    assignment,
    shifts,
}: EditVehicleShiftDialogProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const maxDate = addYears(new Date(), 5)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: assignment ? {
            vehicle_number: assignment.vehicle_number,
            shift_id: assignment.shift_id,
            start_date: new Date(assignment.start_date),
            end_date: new Date(assignment.end_date),
            priority: assignment.priority,
        } : undefined,
    })

    useEffect(() => {
        if (assignment) {
            form.reset({
                vehicle_number: assignment.vehicle_number,
                shift_id: assignment.shift_id,
                start_date: new Date(assignment.start_date),
                end_date: new Date(assignment.end_date),
                priority: assignment.priority,
            })
        }
    }, [assignment, form])

    function handleOpenChange(open: boolean) {
        if (!open) {
            form.reset()
            setIsSubmitting(false)
        }
        onOpenChange(open)
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!assignment?.id) return

        try {
            setIsSubmitting(true)
            const result = await updateVehicleShift(assignment.id, values)

            if (result.error) {
                throw new Error(result.error)
            }

            handleOpenChange(false)
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent 
                className="sm:max-w-sm md:max-w-md"
                onInteractOutside={(e) => {
                    if (isSubmitting) {
                        e.preventDefault()
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Editar Asignación de Vehículo</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="vehicle_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel># Móvil</FormLabel>
                                    <FormControl>
                                        <Input 
                                            type="number" 
                                            min={1}
                                            max={9999}
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value ? Math.max(1, parseInt(e.target.value)) : 0
                                                field.onChange(value)
                                            }}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shift_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Turno</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un turno" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {shifts.map((shift) => (
                                                <SelectItem key={shift.id} value={shift.id}>
                                                    {shift.name}
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
                            name="start_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha Inicio</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value ? "text-muted-foreground" : ""
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < startOfDay(new Date()) || date > maxDate
                                                }
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha Fin</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value ? "text-muted-foreground" : ""
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP", { locale: es })
                                                    ) : (
                                                        <span>Seleccione una fecha</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < startOfDay(form.getValues("start_date")) || date > maxDate
                                                }
                                                initialFocus
                                                locale={es}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Prioridad</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            min={1}
                                            max={100}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
