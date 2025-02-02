"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { InspectionQuestionsDataTable } from "./table/inspection-questions-data-table";
import { InspectionQuestionDialog } from "./inspection-question-dialog";
import { AlertDialogDeleteQuestion } from "./alert-dialog-delete-question";
import { ConfigCardContainer } from "@/components/tables/config-card-container";
import { deleteInspectionQuestion } from "@/lib/services/vehicle/inspection";
import type { InspectionQuestion } from "@/lib/types/vehicle/inspection";

interface InspectionQuestionsConfigProps {
    data: InspectionQuestion[];
    sectionId: string;
}

export function InspectionQuestionsConfig({ data = [], sectionId }: InspectionQuestionsConfigProps) {
    const router = useRouter();
    const [questions, setQuestions] = useState<InspectionQuestion[]>(data);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<InspectionQuestion | null>(null);
    const [questionToEdit, setQuestionToEdit] = useState<InspectionQuestion | undefined>(undefined);

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

    const handleEdit = useCallback((question: InspectionQuestion) => {
        setQuestionToEdit(question);
        setIsDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback((open: boolean) => {
        setIsDialogOpen(open);
        if (!open) {
            setQuestionToEdit(undefined);
        }
    }, []);

    const handleQuestionCreate = useCallback((newQuestion: InspectionQuestion) => {
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    }, []);

    const handleQuestionUpdate = useCallback((updatedQuestion: InspectionQuestion) => {
        setQuestions(prevQuestions =>
            prevQuestions.map(question =>
                question.id === updatedQuestion.id ? updatedQuestion : question
            )
        );
    }, []);

    const handleQuestionDelete = useCallback(async (question: InspectionQuestion) => {
        try {
            await deleteInspectionQuestion(question.id);
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
        <InspectionQuestionDialog
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
            <InspectionQuestionsDataTable
                data={questions}
                onEdit={handleEdit}
                onDelete={setQuestionToDelete}
            />
            {questionDialog}
            {deleteDialog}
        </ConfigCardContainer>
    );
} 