"use client";

import { useState, useEffect, useTransition, FormEvent } from "react";
import { OperationsForm } from "@/lib/types/vehicle/forms";
import { SimpleDialog, SimpleDialogHeader, SimpleDialogTitle, SimpleDialogDescription, SimpleDialogFooter } from "@/components/ui/simple-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateOperationsForm } from "@/lib/services/forms";

export interface OperationsFormEditDialogProps {
	editingForm: OperationsForm;
	onClose: () => void;
	onEditSuccess?: () => void;
}

export function OperationsFormEditDialog({ editingForm, onClose, onEditSuccess }: OperationsFormEditDialogProps) {
	const [title, setTitle] = useState(editingForm.title);
	const [description, setDescription] = useState(editingForm.description);
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setTitle(editingForm.title);
		setDescription(editingForm.description);
	}, [editingForm]);

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		startTransition(async () => {
			try {
				await updateOperationsForm(editingForm.id, { title, description });
				toast({
					title: "Formulario actualizado",
					description: "El formulario se ha actualizado correctamente.",
				});
				onEditSuccess?.();
				onClose();
			} catch (error) {
				toast({
					title: "Error",
					description: "Ha ocurrido un error al actualizar el formulario.",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<SimpleDialog isOpen onClose={onClose}>
			<SimpleDialogHeader>
				<SimpleDialogTitle>Editar formulario</SimpleDialogTitle>
				<SimpleDialogDescription>
					Actualiza el nombre y descripción del formulario.
				</SimpleDialogDescription>
			</SimpleDialogHeader>
			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-gray-700">Nombre</label>
						<Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
					</div>
					<div>
						<label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
						<Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
					</div>
					<SimpleDialogFooter>
						<Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
						<Button type="submit" disabled={isPending}>Guardar</Button>
					</SimpleDialogFooter>
				</div>
			</form>
		</SimpleDialog>
	);
} 