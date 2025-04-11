"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { OperationsFormQuestionsDataTable } from "./questions-table/operations-form-questions-data-table";
import { OperationsFormQuestionDialog } from "./dialogs/operations-form-question-dialog";
import { AlertDialogDeleteQuestion } from "./alert-dialog-delete-question";
import { ConfigCardContainer } from "@/components/tables/config-card-container";
import { deleteQuestion } from "@/lib/services/forms";
import type { OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";

interface OperationsFormQuestionsConfigProps {
    data: OperationsFormQuestion[];
    sectionId: string;
}

export function OperationsFormQuestionsConfig({ data = [], sectionId }: OperationsFormQuestionsConfigProps) {
    const router = useRouter();
    const [questions, setQuestions] = useState<OperationsFormQuestion[]>(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<OperationsFormQuestion | null>(null);
    const [questionToEdit, setQuestionToEdit] = useState<OperationsFormQuestion | undefined>(undefined);

    useEffect(() => {
        if (!isDialogOpen || !questionToEdit) {
            const timer = setTimeout(() => {
                document.body.style.pointerEvents = "";
            }, 0);
            return () => clearTimeout(timer);
        } else {
            document.body.style.pointerEvents = "auto";
        }
    }, [isDialogOpen, questionToEdit]);

    const handleEdit = useCallback((question: OperationsFormQuestion) => {
        setQuestionToEdit(question);
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback((open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setQuestionToEdit(undefined);
        }
    }, []);

    const handleQuestionCreate = useCallback((newQuestion: OperationsFormQuestion) => {
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    }, []);

    const handleQuestionUpdate = useCallback((updatedQuestion: OperationsFormQuestion) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === updatedQuestion.id ? updatedQuestion : question
            )
        );
    }, []);

    const handleQuestionDelete = useCallback(async (question: OperationsFormQuestion) => {
        try {
            await deleteQuestion(question.id);
            setQuestions(prevQuestions =>
                prevQuestions.filter(q => q.id !== question.id)
            );
            toast.success("Pregunta eliminada exitosamente");
        } catch (error) {
            console.error("Error deleting question:", error);
            toast.error("Error al eliminar la pregunta");
        }
    }, []);

    // Memoize the dialog component
    const questionDialog = useMemo(() => (
        <OperationsFormQuestionDialog
            question={questionToEdit}
            open={isDialogOpen}
            onOpenChange={handleDialogClose}
            sectionId={sectionId}
        />
    ), [questionToEdit, isDialogOpen, handleDialogClose, sectionId]);

    // Memoize the delete dialog
    const deleteDialog = useMemo(() => (
        <AlertDialogDeleteQuestion
            question={questionToDelete}
            onOpenChange={(open) => setQuestionToDelete(open ? questionToDelete : null)}
            onSuccess={handleQuestionDelete}
        />
    ), [questionToDelete, handleQuestionDelete]);

    return (
        <ConfigCardContainer 
            title="Preguntas de Inspección"
            onAdd={() => setIsDialogOpen(true)}
        >
            <OperationsFormQuestionsDataTable
                data={questions}
                onEdit={handleEdit}
                onDelete={setQuestionToDelete}
            />
            {questionDialog}
            {deleteDialog}
        </ConfigCardContainer>
    );
} 