"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { OperationsFormQuestion, OperationsFormSection } from "@/lib/types/vehicle/forms";
import { QuestionInput } from "@/components/forms/question-input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { saveOperationsFormAnswer, updateOperationsFormAnswer, updateFormResponse } from "@/lib/services/forms";
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
    const { toast } = useToast();
    const router = useRouter();

    const section = sections[currentSection];
    const isFirstSection = currentSection === 0;
    const isLastSection = currentSection === sections.length - 1;

    // Check if all required questions in the current section are answered
    const areRequiredQuestionsAnswered = () => {
        return section.questions.every(question => {
            if (!question.is_required) return true;
            const answer = localAnswers[question.id]?.value;
            return answer !== undefined && answer !== "";
        });
    };

    // Auto-advance to next section when all required questions are answered
    useEffect(() => {
        if (!isLastSection && areRequiredQuestionsAnswered()) {
            const timer = setTimeout(() => {
                setCurrentSection(prev => prev + 1);
            }, 500); // Small delay for better UX
            return () => clearTimeout(timer);
        }
    }, [localAnswers, isLastSection]);

    async function onAnswerChange(questionId: string, value: string) {
        try {
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
                
                // Store the answer ID for future updates
                setLocalAnswers((prev) => ({
                    ...prev,
                    [questionId]: { id: answer.id, value },
                }));
                return;
            }

            setLocalAnswers((prev) => ({
                ...prev,
                [questionId]: { ...prev[questionId], value },
            }));
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Ha ocurrido un error al guardar la respuesta.",
                variant: "destructive",
            });
        }
    }

    async function onComplete() {
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
        <div className="space-y-6">
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
                        />
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentSection((prev) => prev - 1)}
                    disabled={isFirstSection}
                >
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
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
                        onClick={() => setCurrentSection((prev) => prev + 1)}
                        disabled={isLastSection || !areRequiredQuestionsAnswered()}
                        className="bg-transvip hover:bg-transvip/80"
                    >
                        Siguiente
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    );
} 