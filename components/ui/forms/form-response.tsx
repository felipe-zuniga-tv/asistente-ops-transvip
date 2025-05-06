"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { OperationsFormQuestion, OperationsFormSection } from "@/lib/core/types/vehicle/forms";
import { QuestionInput } from "@/components/ui/forms/question-input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveOperationsFormAnswer, updateOperationsFormAnswer, updateFormResponse } from "@/lib/features/forms";
import { Routes } from "@/utils/routes";

interface FormResponseProps {
    formId: string;
    responseId: string;
    sections: (OperationsFormSection & {
        questions: OperationsFormQuestion[];
    })[];
    answers: Record<string, { id?: string; value: string }>;
}

export function FormResponse({ formId, responseId, sections, answers }: FormResponseProps) {
    const [currentSection, setCurrentSection] = useState(0);
    const [localAnswers, setLocalAnswers] = useState<Record<string, { id?: string; value: string }>>(answers);
    const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set());
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const saveTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
    const { toast } = useToast();
    const router = useRouter();

    const section = sections[currentSection];
    const isFirstSection = currentSection === 0;
    const isLastSection = currentSection === sections.length - 1;

    // Validate inputs based on their type
    const validateInput = useCallback((question: OperationsFormQuestion, value: string): string | null => {
        if (!value && question.is_required) {
            return "Este campo es obligatorio";
        }
        
        if (!value) {
            return null; // Empty non-required field is valid
        }
        
        switch (question.type) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : "Formato de email inválido";
            
            case "number":
                return isNaN(Number(value)) ? "Debe ser un número válido" : null;
                
            // Add more validations as needed
                
            default:
                return null;
        }
    }, []);

    // Validate the current section
    const validateCurrentSection = useCallback((): boolean => {
        const newErrors: Record<string, string> = {};
        let hasErrors = false;

        section.questions.forEach(question => {
            const value = localAnswers[question.id]?.value || "";
            const error = validateInput(question, value);
            
            if (error) {
                newErrors[question.id] = error;
                hasErrors = true;
            }
        });

        setValidationErrors(newErrors);
        return !hasErrors;
    }, [section.questions, localAnswers, validateInput]);
    
    // Check if all required questions in the current section are answered
    const areRequiredQuestionsAnswered = useCallback(() => {
        return section.questions.every(question => {
            if (!question.is_required) return true;
            const answer = localAnswers[question.id]?.value;
            return answer !== undefined && answer !== "";
        });
    }, [localAnswers, section.questions]);

    // Save answers that have pending changes
    const saveAnswer = useCallback(async (questionId: string, value: string) => {
        try {
            setPendingSaves(prev => new Set(prev).add(questionId));
            const currentAnswer = localAnswers[questionId];
            
            if (currentAnswer?.id) {
                // Update existing answer
                await updateOperationsFormAnswer(currentAnswer.id, value);
            } else {
                // Create new answer
                const answer = await saveOperationsFormAnswer({
                    form_id: formId,
                    response_id: responseId,
                    question_id: questionId,
                    answer: value,
                });
                
                // Update the ID in local state
                setLocalAnswers(prev => ({
                    ...prev,
                    [questionId]: { ...prev[questionId], id: answer.id },
                }));
            }
            
            setPendingSaves(prev => {
                const newSet = new Set(prev);
                newSet.delete(questionId);
                return newSet;
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Ha ocurrido un error al guardar la respuesta.",
                variant: "destructive",
            });
            setPendingSaves(prev => {
                const newSet = new Set(prev);
                newSet.delete(questionId);
                return newSet;
            });
        }
    }, [formId, responseId, localAnswers, toast]);

    // Cleanup timeouts on unmount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => {
            Object.values(saveTimeoutsRef.current).forEach(timeout => {
                clearTimeout(timeout);
            });
        };
    }, []);

    function onAnswerChange(questionId: string, value: string) {
        // Clear validation error when user types
        if (validationErrors[questionId]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[questionId];
                return newErrors;
            });
        }

        // Update local state immediately for UI responsiveness
        setLocalAnswers(prev => ({
            ...prev,
            [questionId]: { ...prev[questionId], value },
        }));
        
        // Clear any existing timeout for this question
        if (saveTimeoutsRef.current[questionId]) {
            clearTimeout(saveTimeoutsRef.current[questionId]);
        }
        
        // Set a new timeout to save after user stops typing
        saveTimeoutsRef.current[questionId] = setTimeout(() => {
            saveAnswer(questionId, value);
        }, 1000); // 1 second debounce
    }

    const handlePrevious = () => {
        // We can move backward without validation
        setCurrentSection(prev => prev - 1);
        // Clear validation errors when changing section
        setValidationErrors({});
    };

    const handleNext = () => {
        // Validate current section before advancing
        if (validateCurrentSection()) {
            setCurrentSection(prev => prev + 1);
            // Clear validation errors when changing section
            setValidationErrors({});
        } else {
            toast({
                title: "Validación fallida",
                description: "Por favor corrija los errores antes de continuar.",
                variant: "destructive",
            });
        }
    };

    async function onComplete() {
        // Validate current section before completion
        if (!validateCurrentSection()) {
            toast({
                title: "Validación fallida",
                description: "Por favor corrija los errores antes de completar el formulario.",
                variant: "destructive",
            });
            return;
        }

        // Wait for any pending saves to complete
        const pendingSavesList = Array.from(pendingSaves);
        if (pendingSavesList.length > 0) {
            toast({
                title: "Guardando cambios",
                description: "Espere mientras se guardan los cambios pendientes...",
            });
            
            // Wait for pending saves
            for (const questionId of pendingSavesList) {
                if (saveTimeoutsRef.current[questionId]) {
                    clearTimeout(saveTimeoutsRef.current[questionId]);
                    await saveAnswer(questionId, localAnswers[questionId].value);
                }
            }
        }

        // Check if all required questions in all sections are answered
        const allRequiredAnswered = sections.every(section =>
            section.questions.every(question => {
                if (!question.is_required) return true;
                const answer = localAnswers[question.id]?.value;
                return answer !== undefined && answer !== "";
            })
        );

        if (!allRequiredAnswered) {
            toast({
                title: "Formulario incompleto",
                description: "Por favor complete todas las preguntas obligatorias.",
                variant: "destructive",
            });
            return;
        }

        try {
            // Mark the response as completed
            await updateFormResponse(responseId, {
                status: 'completed',
                completed_at: new Date().toISOString()
            });

            toast({
                title: "Formulario completado",
                description: "El formulario ha sido completado exitosamente.",
            });
            router.refresh();
            router.push(Routes.PUBLIC.FORMULARIOS);
        } catch (error) {
            toast({
                title: "Error",
                description: "Ha ocurrido un error al completar el formulario.",
                variant: "destructive",
            });
        }
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 justify-start items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                    {section.title}
                </h2>
                <div className="text-sm text-muted-foreground">
                    Sección {currentSection + 1} de {sections.length}
                </div>
            </div>

            <Card className="border-0 shadow-none bg-white">
                <CardHeader>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {section.questions.map((question) => (
                        <QuestionInput
                            key={question.id}
                            question={question}
                            value={localAnswers[question.id]?.value ?? ""}
                            onChange={(value) => onAnswerChange(question.id, value)}
                            required={question.is_required}
                            error={validationErrors[question.id]}
                        />
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstSection}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                </Button>

                {isLastSection ? (
                    <Button 
                        onClick={onComplete} 
                        className="bg-transvip hover:bg-transvip/80"
                        disabled={!areRequiredQuestionsAnswered()}
                    >
                        Completar
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        disabled={!areRequiredQuestionsAnswered()}
                        className="bg-transvip hover:bg-transvip/80"
                    >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
} 