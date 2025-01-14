'use client'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import { AlertDialogDeleteShift } from "./alert-dialog-delete-shift";
import { Shift } from "./shifts-content";

const WEEKDAYS = {
	1: "Lunes",
	2: "Martes",
	3: "Miércoles",
	4: "Jueves",
	5: "Viernes",
	6: "Sábado",
	7: "Domingo",
};

interface ShiftsTableContentProps {
	shifts: any[] | null;
	onEdit: (shift: any) => void;
	onDelete: (id: Shift) => void;
	nameFilter: string;
	selectedDays: number[];
}

const FORMAT_DATE = "dd/MM/yyyy HH:mm:ss"

export function ShiftsTableContent({ shifts, onEdit, onDelete, nameFilter, selectedDays }: ShiftsTableContentProps) {
	const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

	const filteredShifts = shifts?.filter(shift =>
		shift.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
		selectedDays.includes(shift.free_day)
	);

	return (
		<>
			<div className="py-1 text-sm flex flex-row gap-1 items-center">
				<span className="font-bold">Total:</span>
				<span className="font-normal">{shifts?.length} resultados</span>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">Acciones</TableHead>
						<TableHead className="text-center">#</TableHead>
						<TableHead className="text-center">Nombre</TableHead>
						<TableHead className="text-center">Hora Inicio</TableHead>
						<TableHead className="text-center">Hora Fin</TableHead>
						<TableHead className="text-center">Día Libre</TableHead>
						<TableHead className="text-center">Creado</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredShifts?.map((shift, index) => (
						<TableRow key={shift.id}>
							<TableCell className="text-center">
								<div className="flex justify-center gap-2">
									<Button variant="ghost" size="sm" onClick={() => onEdit(shift)}>
										<Pencil className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => setShiftToDelete(shift)}
										className="text-destructive hover:text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							</TableCell>
							<TableCell className="text-center">{index + 1}</TableCell>
							<TableCell className="text-center">{shift.name}</TableCell>
							<TableCell className="text-center">{shift.start_time}</TableCell>
							<TableCell className="text-center">{shift.end_time}</TableCell>
							<TableCell className="text-center">{WEEKDAYS[shift.free_day as keyof typeof WEEKDAYS]}</TableCell>
							<TableCell className="text-center">{format(new Date(shift.created_timestamp), FORMAT_DATE)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<AlertDialogDeleteShift 
				shift={shiftToDelete}
				onOpenChange={(open) => setShiftToDelete(open ? shiftToDelete : null)}
				onDelete={onDelete}
			/>
		</>
	);
}