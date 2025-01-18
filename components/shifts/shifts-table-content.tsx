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
import { Shift, WEEKDAYS } from "./shifts-definition";

interface ShiftsTableContentProps {
	shifts: any[] | null;
	onEdit: (shift: Shift) => void;
	onDelete: (id: Shift) => void;
	nameFilter: string;
	selectedDays: number[];
}

export const FORMAT_DATE = "dd/MM/yyyy HH:mm:ss"

export function ShiftsTable({ shifts, onEdit, onDelete, nameFilter, selectedDays }: ShiftsTableContentProps) {
	const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

	const filteredShifts = shifts?.filter(shift =>
		shift.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
		selectedDays.includes(shift.free_day)
	);

	return (
		<>
			<div className="py-1 text-sm flex flex-row gap-1 items-center">
				<span className="font-bold">Total:</span>
				<span className="font-normal">{filteredShifts?.length} resultado{filteredShifts?.length === 1 ? "" : "s"}</span>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-center">#</TableHead>
						<TableHead className="text-center">Nombre</TableHead>
						<TableHead className="text-center">Hora Inicio</TableHead>
						<TableHead className="text-center">Hora Fin</TableHead>
						<TableHead className="text-center">Día Libre</TableHead>
						<TableHead className="text-center">Creado</TableHead>
						<TableHead className="text-center">Editar</TableHead>
						<TableHead className="text-center text-red-400">Borrar</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredShifts?.map((shift, index) => (
						<TableRow key={shift.id}>
							<TableCell className="text-center">{index + 1}</TableCell>
							<TableCell className="text-center">{shift.name}</TableCell>
							<TableCell className="text-center">{shift.start_time}</TableCell>
							<TableCell className="text-center">{shift.end_time}</TableCell>
							<TableCell className="text-center">
								{WEEKDAYS.find(day => day.value === String(shift.free_day))?.label}
							</TableCell>
							<TableCell className="text-center">{format(new Date(shift.created_timestamp), FORMAT_DATE)}</TableCell>
							<TableCell className="text-center w-[36px] px-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => onEdit(shift)} 
									className="bg-slate-100 hover:bg-slate-200 shadow"
								>
									<Pencil className="h-4 w-4" />
								</Button>
							</TableCell>
							<TableCell className="text-center w-[36px] px-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShiftToDelete(shift)}
									className="text-destructive hover:text-destructive bg-red-500/10 hover:bg-red-500/20 shadow"
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</TableCell>
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