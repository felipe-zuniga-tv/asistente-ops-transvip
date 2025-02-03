export type QuestionType = 'text' | 'number' | 'image' | 'email';

export interface OperationsForm {
    id: string;
    title: string;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OperationsFormSection {
    id: string;
    form_id: string;
    title: string;
    description: string;
    order: number;
    created_at: string;
    updated_at: string;
}

export interface OperationsFormQuestion {
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

export interface OperationsFormResponses {
    id: string;
    form_id: string;
    vehicle_number: number;
    status: 'draft' | 'completed';
    created_by: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

export interface OperationsFormAnswer {
    id: string;
    form_id: string;
    question_id: string;
    answer: string;
    created_at: string;
    updated_at: string;
}

export interface CreateOperationsFormInput {
    title: string;
    description: string;
    is_active?: boolean;
}

export interface UpdateOperationsFormInput extends Partial<CreateOperationsFormInput> {}

export interface CreateOperationsFormSectionInput {
    form_id: string;
    title: string;
    description: string;
    order: number;
}

export interface UpdateOperationsFormSectionInput extends Partial<Omit<CreateOperationsFormSectionInput, 'form_id'>> {}

export interface CreateOperationsFormQuestionInput {
    section_id: string;
    label: string;
    type: QuestionType;
    order: number;
    allow_gallery_access?: boolean;
}

export interface UpdateOperationsFormQuestionInput extends Partial<Omit<CreateOperationsFormQuestionInput, 'section_id'>> {
    is_active?: boolean;
}

export interface CreateVehicleInspectionInput {
    form_id: string;
    vehicle_number: number;
}

export interface CreateOperationsFormAnswerInput {
    inspection_id: string;
    question_id: string;
    answer: string;
} 