export type QuestionType = 'text' | 'number' | 'image' | 'email';

export interface InspectionForm {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface InspectionSection {
    id: string;
    form_id: string;
    title: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface InspectionQuestion {
    id: string;
    section_id: string;
    label: string;
    type: QuestionType;
    order: number;
    is_active: boolean;
    allow_gallery_access?: boolean;
    created_at: string;
    updated_at: string;
}

export interface VehicleInspection {
    id: string;
    form_id: string;
    vehicle_number: number;
    status: 'draft' | 'completed';
    created_by: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

export interface InspectionAnswer {
    id: string;
    inspection_id: string;
    question_id: string;
    answer: string;
    created_at: string;
    updated_at: string;
}

export interface CreateInspectionFormInput {
    title: string;
    description: string;
}

export interface UpdateInspectionFormInput extends Partial<CreateInspectionFormInput> {
    is_active?: boolean;
}

export interface CreateInspectionSectionInput {
    form_id: string;
    title: string;
    description: string;
    order: number;
}

export interface UpdateInspectionSectionInput extends Partial<Omit<CreateInspectionSectionInput, 'form_id'>> {}

export interface CreateInspectionQuestionInput {
    section_id: string;
    label: string;
    type: QuestionType;
    order: number;
    allow_gallery_access?: boolean;
}

export interface UpdateInspectionQuestionInput extends Partial<Omit<CreateInspectionQuestionInput, 'section_id'>> {
    is_active?: boolean;
}

export interface CreateInspectionInput {
    form_id: string;
    vehicle_number: number;
}

export interface CreateInspectionAnswerInput {
    inspection_id: string;
    question_id: string;
    answer: string;
} 