"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Draggable, Droppable, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { GripVertical, PlusCircle, Pencil, ChevronDown } from "lucide-react";
import { cn } from '@/utils/ui';
import { OperationsFormSection, OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";
import { DraggableQuestion } from "./draggable-question";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface DraggableSectionProps {
    section: OperationsFormSection & { questions: OperationsFormQuestion[] };
    index: number;
    onEditSection: (section: OperationsFormSection & { questions: OperationsFormQuestion[] }) => void;
    onAddQuestion: (section: OperationsFormSection & { questions: OperationsFormQuestion[] }) => void;
    onEditQuestion: (section: OperationsFormSection & { questions: OperationsFormQuestion[] }, question: OperationsFormQuestion) => void;
}

export function DraggableSection({ section, index, onEditSection, onAddQuestion, onEditQuestion }: DraggableSectionProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Draggable draggableId={section.id} index={index}>
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                        "border",
                        snapshot.isDragging ? "border-primary" : ""
                    )}
                >
                    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                        <CardHeader className={cn(
                            "flex flex-row items-center justify-between space-y-0 pt-4",
                            !isOpen ? "pb-4" : "pb-2"
                        )}>
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
                            <div className="flex items-center gap-6">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEditSection(section)}
                                    className="shadow"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Editar
                                </Button>
                                <CollapsibleTrigger asChild>
                                    <Button variant="default" size="icon" className="bg-transvip hover:bg-transvip-dark">
                                        <ChevronDown className={`h-4 w-4 transition-transform ${!isOpen ? "-rotate-90" : ""}`} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                        </CardHeader>
                        <CollapsibleContent>
                            <Separator className="mt-2 mb-3" />
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-start gap-8">
                                        <h3 className="text-sm font-medium">Preguntas</h3>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => onAddQuestion(section)}
                                            className="shadow"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Agregar Pregunta
                                        </Button>
                                    </div>

                                    <Droppable droppableId={`questions-${section.id}`} type="question">
                                        {(provided: DroppableProvided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-2"
                                            >
                                                {section.questions.map((question, index) => (
                                                    <DraggableQuestion
                                                        key={question.id}
                                                        question={question}
                                                        index={index}
                                                        onEdit={() => onEditQuestion(section, question)}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Collapsible>
                </Card>
            )}
        </Draggable>
    );
} 