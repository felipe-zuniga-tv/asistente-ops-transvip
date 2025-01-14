"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "../ui/label";
import { createShift } from "@/lib/database/actions";
import { useTransition } from "react";
import { WEEKDAYS } from "./shifts-content";

interface NewShiftDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function NewShiftDialog({ open, onOpenChange }: NewShiftDialogProps) {
	const [isPending, startTransition] = useTransition();

	const handleCreate = async (formData: FormData) => {
		startTransition(async () => {
			try {
				const shiftData = {
					name: formData.get('name') as string,
					start_time: formData.get('startTime') as string,
					end_time: formData.get('endTime') as string,
					free_day: parseInt(formData.get('freeDay') as string),
				};

				await createShift(shiftData);
				toast.success("Turno creado exitosamente");
				onOpenChange(false);
			} catch (error) {
				toast.error("Error al crear el turno");
				console.error(error);
			}
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Nueva Jornada</DialogTitle>
				</DialogHeader>
				<form action={handleCreate} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Nombre del Turno</Label>
						<Input
							id="name"
							name="name"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="startTime">Hora Inicio</Label>
							<Input
								id="startTime"
								name="startTime"
								type="time"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="endTime">Hora Fin</Label>
							<Input
								id="endTime"
								name="endTime"
								type="time"
								required
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label>Día Libre</Label>
						<Select name="freeDay">
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar día libre" />
							</SelectTrigger>
							<SelectContent>
								{WEEKDAYS.map((day) => (
									<SelectItem key={day.value} value={day.value}>
										{day.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex justify-end space-x-2">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending ? "Guardando..." : "Guardar"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}