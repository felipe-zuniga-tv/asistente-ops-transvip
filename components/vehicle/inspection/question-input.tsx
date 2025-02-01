"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageInput } from "@/components/vehicle/inspection/image-input";
import { InspectionQuestion } from "@/lib/types/vehicle/inspection";

interface QuestionInputProps {
    question: InspectionQuestion;
    value: string;
    onChange: (value: string) => void;
}

export function QuestionInput({ question, value, onChange }: QuestionInputProps) {
    return (
        <div className="space-y-2">
            <Label>{question.label}</Label>
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
                />
            )}
        </div>
    );
} 