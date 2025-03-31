export const QUESTION_TYPE_CONFIG = {
    text: { label: "Texto" },
    number: { label: "Número" },
    image: { label: "Imagen" },
    email: { label: "Email" },
    options: { label: "Opciones" },
} as const;

export type QuestionType = keyof typeof QUESTION_TYPE_CONFIG;

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

export interface OperationsFormQuestionOption {
    id: string;
    question_id: string;
    label: string;
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
    is_required: boolean;
    allow_gallery_access?: boolean;
    options?: OperationsFormQuestionOption[];
    created_at: string;
    updated_at: string;
}

export interface OperationsFormResponses {
    id: string;
    form_id: string;
    status: 'draft' | 'completed';
    created_by: string;
    created_at: string;
    updated_at: string;
    completed_at?: string;
}

export interface OperationsFormAnswer {
    id: string;
    form_id: string;
    response_id: string;
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
    is_required?: boolean;
    allow_gallery_access?: boolean;
    options?: { label: string; order: number; }[];
}

export interface UpdateOperationsFormQuestionInput extends Partial<Omit<CreateOperationsFormQuestionInput, 'section_id'>> {
    is_active?: boolean;
}

export interface CreateOperationsFormResponseInput {
    form_id: string;
    id: string;
}

export interface CreateOperationsFormAnswerInput {
    form_id: string;
    response_id: string;
    question_id: string;
    answer: string;
} export interface VehicleShift {
    id: string;
    vehicle_number: number;
    shift_name: string;
    shift_id: string;
    branch_id: string;
    branch_name: string;
    start_date: string;
    end_date: string;
    start_time?: string;
    end_time?: string;
    priority: number;
}

export interface VehicleShiftWithShiftInfo extends VehicleShift {
    free_day?: number;
    status_color?: string;
    isStatus?: boolean;
    created_at: string;
}

export interface VehicleShiftWithFreeDay extends VehicleShiftWithShiftInfo {
    isFreeDay?: boolean;
    isStatus?: boolean;
    status_color?: string;
}

export interface ShiftData {
    id?: string;
    branch_id: string;
    name: string;
    start_time: string;
    end_time: string;
    free_day: number;
    created_timestamp?: string;
} export interface VehicleStatusConfig {
    id: string;
    label: string;
    description: string | null;
    color: string;
    created_at: string;
}

export interface VehicleStatus {
    id: string;
    vehicle_number: string;
    status_id: string;
    status_label: string;
    status_color: string;
    start_date: string;
    end_date: string;
    comments: string | null;
    created_at: string;
    created_by: string | null;
    updated_by?: string | null;
    is_active?: boolean;
    branch_id?: string;
    branch_name?: string;
}

export interface CreateVehicleStatusInput {
    vehicle_number: string;
    status_id: string;
    start_date: string;
    end_date: string;
    comments?: string;
    created_by?: string;
    updated_by?: string;
    is_active?: boolean;
} 