"use client";

import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewShiftDialog } from "./new-shift-dialog";
import { TransvipLogo } from "../transvip/transvip-logo";
import { ShiftsTableContent } from "./shifts-table-content";
import { EditShiftDialog } from "./edit-shift-dialog";
import { deleteShift } from "@/lib/database/actions";

export const WEEKDAYS = [
	{ value: "1", label: "Lunes" },
	{ value: "2", label: "Martes" },
	{ value: "3", label: "Miércoles" },
	{ value: "4", label: "Jueves" },
	{ value: "5", label: "Viernes" },
	{ value: "6", label: "Sábado" },
	{ value: "7", label: "Domingo" },
];

export interface Shift {
    id: string;
    name: string;
    start_time: string;
    end_time: string;
    free_day: number;
}

interface ShiftsCardProps {
    shifts: Shift[];
}

export function ShiftsCard({ shifts }: ShiftsCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [nameFilter, setNameFilter] = useState("");
    const [selectedDays, setSelectedDays] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [editingShift, setEditingShift] = useState<any>(null);

    const handleEditShift = (shift: Shift) => {
        const shiftToEdit = {
            id: shift.id,
            name: shift.name,
            start_time: shift.start_time,
            end_time: shift.end_time,
            free_day: shift.free_day
        };
        setEditingShift(shiftToEdit);
        setIsEditDialogOpen(true);
    };

    const handleDeleteShift = async (shift: Shift) => {
        try {
            await deleteShift(shift.id);
        } catch (error) {
            console.error('Error deleting shift:', error);
            // You might want to add toast notification here for error handling
        }
    };

    return (
        <Card className="max-w-4xl mx-2 lg:mx-auto">
            <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2">
                        <TransvipLogo size={20} />
                        <span className="text-sm sm:text-base">Jornadas de Conexión</span>
                    </div>
                    <Button className="ml-auto text-xs md:text-sm" onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="w-4 h-4" />
                        Añadir
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 pb-4 pl-2">
                    <Switch
                        checked={showFilters}
                        onCheckedChange={setShowFilters}
                    />
                    <Label>{showFilters ? "Ocultar" : "Mostrar"} Filtros</Label>
                </div>
                {showFilters && (
                    <div className="mb-4 space-y-4 p-4 border rounded-md">
                        <div>
                            <Label className="mb-2 block">Días libres</Label>
                            <div className="flex flex-wrap gap-4">
                                {WEEKDAYS.map((weekday) => (
                                    <div key={weekday.value} className="flex items-center space-x-2 border rounded-md p-2 w-fit">
                                        <Checkbox
                                            id={`day-${weekday.value}`}
                                            checked={selectedDays.includes(Number(weekday.value))}
                                            onCheckedChange={(checked) => {
                                                setSelectedDays(prev =>
                                                    checked
                                                        ? [...prev, Number(weekday.value)]
                                                        : prev.filter(d => d !== Number(weekday.value))
                                                );
                                            }}
                                        />
                                        <Label className="text-sm font-medium cursor-pointer w-full" htmlFor={`day-${weekday.value}`}>
                                            {weekday.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-4 mb-8">
                    <div className="relative">
                        <Input
                            placeholder="Filtrar por nombre..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="peer pe-9 ps-9 max-w-xs"
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <Search size={16} strokeWidth={2} />
                        </div>
                    </div>
                </div>

                <ShiftsTableContent
                    shifts={shifts}
                    onEdit={handleEditShift}
                    onDelete={handleDeleteShift}
                    nameFilter={nameFilter}
                    selectedDays={selectedDays}
                />
            </CardContent>
            <NewShiftDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
            <EditShiftDialog
                shift={editingShift}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
            />
        </Card>
    );
}