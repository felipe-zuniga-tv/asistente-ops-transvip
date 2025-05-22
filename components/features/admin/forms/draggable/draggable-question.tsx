"use client";

import { Button } from "@/components/ui";
import { Draggable, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { GripVertical, Settings2 } from "lucide-react";
import { OperationsFormQuestion, QUESTION_TYPE_CONFIG } from "@/types/domain/forms/types";
import { cn } from '@/utils/ui';

interface DraggableQuestionProps {
    question: OperationsFormQuestion;
    index: number;
    onEdit: () => void;
}

export function DraggableQuestion({ question, index, onEdit }: DraggableQuestionProps) {
    return (
        <Draggable draggableId={question.id} index={index}>
            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
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
                                {question.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tipo: {QUESTION_TYPE_CONFIG[question.type].label}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                    >
                        <Settings2 className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </Draggable>
    );
} 