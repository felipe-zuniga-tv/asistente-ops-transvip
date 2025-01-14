'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

interface AlertDialogDeleteShiftProps {
	shift: Shift | null;
	onOpenChange: (open: boolean) => void;
	onDelete: (shift: Shift) => void;
}

export function AlertDialogDeleteShift({ shift, onOpenChange, onDelete }: AlertDialogDeleteShiftProps) {
	return (
		<AlertDialog open={!!shift} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
					<AlertDialogDescription>
						<div className="flex flex-col gap-2">
							<span>Esta acción no se puede deshacer.</span>
							<div>Se eliminará el siguiente turno de manera <span className="font-bold">permanente</span>:</div>
							<div className="p-3 bg-gray-100 rounded-md shadow-md">
								<div className="flex flex-row items-center gap-2">
									<span className="font-semibold">Nombre</span>
									<span>{shift?.name}</span>
								</div>
								<div className="flex flex-row items-center gap-2">
									<div className="flex flex-row items-center gap-2">
										<span className="font-semibold">Hora Inicio:</span>
										<span>{shift?.start_time}</span>
									</div>
									<span>·</span>
									<div className="flex flex-row items-center gap-2">
										<span className="font-semibold">Hora Fin:</span>
										<span>{shift?.end_time}</span>
									</div>
									<span>·</span>
									<div className="flex flex-row items-center gap-2">
										<span className="font-semibold">Día Libre:</span>
										<span>{WEEKDAYS[shift?.free_day as keyof typeof WEEKDAYS]}</span>
									</div>
								</div>
							</div>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive hover:bg-destructive/90"
						onClick={() => {
							if (shift) {
								onDelete(shift);
								onOpenChange(false);
							}
						}}
					>
						Eliminar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
