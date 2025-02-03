"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OperationsFormSectionDialog } from "./operations-form-section-dialog";
import { OperationsFormQuestionDialog } from "./operations-form-question-dialog";
import { OperationsForm, OperationsFormSection, OperationsFormQuestion } from "@/lib/types/vehicle/forms";
import { Plus, GripVertical, Settings2 } from "lucide-react";
import { DragDropContext, Draggable, Droppable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface OperationsFormEditorProps {
    form: OperationsForm & {
        sections: (OperationsFormSection & {
            questions: OperationsFormQuestion[];
        })[];
    };
}

export function OperationsFormEditor({ form }: OperationsFormEditorProps) {
    const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [selectedSection, setSelectedSection] = useState<OperationsFormSection & { questions: OperationsFormQuestion[] }>();
    const [selectedQuestion, setSelectedQuestion] = useState<OperationsFormQuestion>();
    const router = useRouter();

    function onDragEnd(result: DropResult) {
        // TODO: Implement drag and drop reordering
        router.refresh();
    }

    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{form.title}</h2>
                    <p className="text-muted-foreground">{form.description}</p>
                </div>
                <Badge variant={form.is_active ? "default" : "secondary"} className={form.is_active ? "bg-green-500" : "bg-red-500"}>
                    {form.is_active ? "Activo" : "Inactivo"}
                </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Secciones</h3>
                    <Button
                        onClick={() => {
                            setSelectedSection(undefined);
                            setSectionDialogOpen(true);
                        }}
                        className="bg-transvip hover:bg-transvip/80"
                    >
                        <Plus className="h-4 w-4" />
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
                                    <Draggable
                                        key={section.id}
                                        draggableId={section.id}
                                        index={index}
                                    >
                                        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className={cn(
                                                    "border",
                                                    snapshot.isDragging ? "border-primary" : ""
                                                )}
                                            >
                                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="flex items-center space-x-4"
                                                    >
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                        <div className="space-y-1">
                                                            <CardTitle>{section.title}</CardTitle>
                                                            <CardDescription className="text-xs">
                                                                {section.description}
                                                            </CardDescription>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setSelectedSection(section);
                                                            setSectionDialogOpen(true);
                                                        }}
                                                    >
                                                        <Settings2 className="h-4 w-4" />
                                                    </Button>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-sm font-medium">
                                                                Preguntas
                                                            </h4>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedSection(section);
                                                                    setSelectedQuestion(undefined);
                                                                    setQuestionDialogOpen(true);
                                                                }}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                                Agregar Pregunta
                                                            </Button>
                                                        </div>

                                                        <Droppable
                                                            droppableId={`questions-${section.id}`}
                                                        >
                                                            {(provided: DroppableProvided) => (
                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    className="space-y-2"
                                                                >
                                                                    {section.questions.map(
                                                                        (question, index) => (
                                                                            <Draggable
                                                                                key={question.id}
                                                                                draggableId={
                                                                                    question.id
                                                                                }
                                                                                index={index}
                                                                            >
                                                                                {(
                                                                                    provided: DraggableProvided,
                                                                                    snapshot: DraggableStateSnapshot
                                                                                ) => (
                                                                                    <div
                                                                                        ref={provided.innerRef}
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        className={cn(
                                                                                            "flex items-center justify-between rounded-lg border p-3",
                                                                                            snapshot.isDragging ? "border-primary" : "",
                                                                                            !question.is_active ? "opacity-50" : ""
                                                                                        )}
                                                                                    >
                                                                                        <div className="flex items-center space-x-4">
                                                                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                                                            <div>
                                                                                                <p className="text-sm font-medium">
                                                                                                    {
                                                                                                        question.label
                                                                                                    }
                                                                                                </p>
                                                                                                <p className="text-sm text-muted-foreground">
                                                                                                    Tipo:{" "}
                                                                                                    {
                                                                                                        question.type
                                                                                                    }
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="icon"
                                                                                            onClick={() => {
                                                                                                setSelectedSection(
                                                                                                    section
                                                                                                );
                                                                                                setSelectedQuestion(
                                                                                                    question
                                                                                                );
                                                                                                setQuestionDialogOpen(
                                                                                                    true
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            <Settings2 className="h-4 w-4" />
                                                                                        </Button>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        )
                                                                    )}
                                                                    {provided.placeholder}
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </Draggable>
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
                    onOpenChange={setQuestionDialogOpen}
                    sectionId={selectedSection.id}
                    question={selectedQuestion}
                    currentOrder={selectedSection.questions.length}
                />
            )}
        </div>
    );
} 