"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OperationsFormQuestion } from "@/lib/core/types/vehicle/forms";
import { ImageInput } from "@/components/forms/image-input";

interface QuestionInputProps {
    question: OperationsFormQuestion;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
}

export function QuestionInput({ question, value, onChange, required = question.is_required }: QuestionInputProps) {
    return (
        <div className="space-y-2">
            <div className="space-y-1">
                <Label>
                    {question.label}
                    {required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {required && (
                    <p className="text-[0.8rem] text-muted-foreground -mt-0.5">
                        Este campo es obligatorio
                    </p>
                )}
            </div>
            {question.type === "image" ? (
                <ImageInput
                    value={value}
                    onChange={onChange}
                    allowGallery={question.allow_gallery_access}
                />
            ) : (
                <Input
                    type={question.type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            )}
        </div>
    );
} 