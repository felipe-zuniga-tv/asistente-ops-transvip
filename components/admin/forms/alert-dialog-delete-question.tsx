"use client";

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
import type { OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";

interface AlertDialogDeleteQuestionProps {
    question: OperationsFormQuestion | null;
    onOpenChange: (open: boolean) => void;
    onSuccess: (question: OperationsFormQuestion) => void;
}

export function AlertDialogDeleteQuestion({
    question,
    onOpenChange,
    onSuccess,
}: AlertDialogDeleteQuestionProps) {
    if (!question) return null;

    const handleDelete = async () => {
        await onSuccess(question);
        onOpenChange(false);
    };

    return (
        <AlertDialog open={!!question} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la pregunta
                        &quot;{question.label}&quot; del formulario.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 