"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OperationsFormSectionDialog } from "./operations-form-section-dialog";
import { OperationsFormQuestionDialog } from "./operations-form-question-dialog";
import { OperationsForm, OperationsFormSection, OperationsFormQuestion } from "@/lib/types/vehicle/forms";
import { PlusCircle } from "lucide-react";
import { DragDropContext, Droppable, DropResult, DroppableProvided } from "@hello-pangea/dnd";
import { ConfigCardContainer } from "@/components/tables/config-card-container";
import { DraggableSection } from "./draggable-section";

interface OperationsFormEditorProps {
    form: OperationsForm & {
        sections: (OperationsFormSection & {
            questions: OperationsFormQuestion[];
        })[];
    };
}

export function OperationsFormEditor({ form }: OperationsFormEditorProps) {
    const router = useRouter();
    const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<OperationsFormSection & { questions: OperationsFormQuestion[] }>();
    const [selectedQuestion, setSelectedQuestion] = useState<OperationsFormQuestion>();

    function onDragEnd(result: DropResult) {
        // TODO: Implement drag and drop reordering
        router.refresh();
    }

    return (
        <ConfigCardContainer title={form.title} className="max-w-full">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{form.description}</p>
                <Badge variant={form.is_active ? "default" : "secondary"} className={form.is_active ? "bg-green-500" : "bg-red-500"}>
                    {form.is_active ? "Activo" : "Inactivo"}
                </Badge>
            </div>

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
                    <Droppable droppableId="sections">
                        {(provided: DroppableProvided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {form.sections.map((section, index) => (
                                    <DraggableSection
                                        key={section.id}
                                        section={section}
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
                currentOrder={form.sections.length}
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
                />
            )}
        </ConfigCardContainer>
    );
} 