"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OperationsFormSectionDialog } from "./dialogs/operations-form-section-dialog";
import { OperationsFormQuestionDialog } from "./dialogs/operations-form-question-dialog";
import { OperationsForm, OperationsFormSection, OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { DragDropContext, Droppable, DropResult, DroppableProvided } from "@hello-pangea/dnd";
import { ConfigCardContainer } from "@/components/ui/tables/config-card-container";
import { DraggableSection } from "./draggable/draggable-section";
import Link from "next/link";
import { Routes } from "@/utils/routes";
import { reorderSections, reorderQuestions } from "@/lib/features/forms";
import { toast } from "sonner";

interface OperationsFormEditorProps {
    form: OperationsForm & {
        sections: (OperationsFormSection & {
            questions: OperationsFormQuestion[];
        })[];
    };
}

export function OperationsFormEditor({ form }: OperationsFormEditorProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<OperationsFormSection & { questions: OperationsFormQuestion[] }>();
    const [selectedQuestion, setSelectedQuestion] = useState<OperationsFormQuestion>();
    const [sections, setSections] = useState(form.sections);

    const handleQuestionUpdate = useCallback((updatedQuestion: OperationsFormQuestion) => {
        setSections(prevSections => 
            prevSections.map(section => {
                if (section.id === selectedSection?.id) {
                    return {
                        ...section,
                        questions: section.questions.map(q => 
                            q.id === updatedQuestion.id ? updatedQuestion : q
                        )
                    };
                }
                return section;
            })
        );
    }, [selectedSection?.id]);

    async function onDragEnd(result: DropResult) {
        if (!result.destination) return;

        const { source, destination, type } = result;

        // Handle section reordering
        if (type === "section") {
            const items = Array.from(sections);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            // Update local state immediately for optimistic UI
            setSections(items);

            startTransition(async () => {
                try {
                    // Prepare data for the server
                    const updatedSections = items.map((section, index) => ({
                        id: section.id,
                        order: index + 1,
                    }));

                    // Call server action
                    const response = await reorderSections(form.id, { sections: updatedSections });

                    if (!response.success) {
                        throw new Error('Failed to reorder sections');
                    }

                    // Refresh the router to get the latest data
                    router.refresh();
                } catch (error) {
                    // Revert optimistic update on error
                    setSections(form.sections);
                    toast.error("Error al reordenar las secciones");
                }
            });
            return;
        }

        // Handle question reordering
        if (type === "question") {
            const sectionId = source.droppableId.replace('questions-', '');
            const section = sections.find(s => s.id === sectionId);
            
            if (!section) return;

            const newSections = [...sections];
            const sectionIndex = newSections.findIndex(s => s.id === sectionId);
            const questions = Array.from(section.questions);
            const [reorderedItem] = questions.splice(source.index, 1);
            questions.splice(destination.index, 0, reorderedItem);

            // Update local state immediately for optimistic UI
            newSections[sectionIndex] = {
                ...section,
                questions
            };
            setSections(newSections);

            startTransition(async () => {
                try {
                    // Prepare data for the server
                    const updatedQuestions = questions.map((question, index) => ({
                        id: question.id,
                        order: index + 1,
                    }));

                    // Call server action
                    const response = await reorderQuestions(sectionId, { questions: updatedQuestions });

                    if (!response.success) {
                        throw new Error('Failed to reorder questions');
                    }

                    // Refresh the router to get the latest data
                    router.refresh();
                } catch (error) {
                    // Revert optimistic update on error
                    setSections(form.sections);
                    toast.error("Error al reordenar las preguntas");
                }
            });
        }
    }

    return (
        <ConfigCardContainer title={form.title} className="max-w-full">
            <div className="flex items-center justify-start gap-6">
                <p className="text-sm text-muted-foreground">{form.description}</p>
                <Badge variant={form.is_active ? "default" : "secondary"} className={form.is_active ? "bg-green-500" : "bg-red-500"}>
                    {form.is_active ? "Activo" : "Inactivo"}
                </Badge>
            </div>
            <Button variant="default" size="sm" asChild>
                <Link href={Routes.OPERATIONS_FORMS.CONFIG} className="text-sm text-muted-foreground">
                    <ArrowLeft /> Volver a formularios
                </Link>
            </Button>

            <Separator />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Secciones</h3>
                    <Button
                        size={"sm"}
                        onClick={() => {
                            setSelectedSection(undefined);
                            setSectionDialogOpen(true);
                        }}
                        className="bg-transvip hover:bg-transvip/80"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Agregar Sección
                    </Button>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections" type="section">
                        {(provided: DroppableProvided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {sections.map((section, index) => (
                                    <DraggableSection
                                        key={section.id}
                                        section={{
                                            ...section,
                                            title: `${index + 1}. ${section.title}`
                                        }}
                                        index={index}
                                        onEditSection={(section) => {
                                            setSelectedSection(section);
                                            setSectionDialogOpen(true);
                                        }}
                                        onAddQuestion={(section) => {
                                            setSelectedSection(section);
                                            setSelectedQuestion(undefined);
                                            setQuestionDialogOpen(true);
                                        }}
                                        onEditQuestion={(section, question) => {
                                            setSelectedSection(section);
                                            setSelectedQuestion(question);
                                            setQuestionDialogOpen(true);
                                        }}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <OperationsFormSectionDialog
                open={sectionDialogOpen}
                onOpenChange={setSectionDialogOpen}
                formId={form.id}
                section={selectedSection}
                currentOrder={selectedSection ? sections.findIndex(s => s.id === selectedSection.id) + 1 : sections.length + 1}
            />

            {selectedSection && (
                <OperationsFormQuestionDialog
                    open={questionDialogOpen}
                    onOpenChange={(open) => {
                        setQuestionDialogOpen(open);
                        if (!open) {
                            setSelectedQuestion(undefined);
                        }
                    }}
                    sectionId={selectedSection.id}
                    question={selectedQuestion}
                    currentOrder={selectedSection.questions.length}
                    onQuestionUpdate={handleQuestionUpdate}
                />
            )}
        </ConfigCardContainer>
    );
} 