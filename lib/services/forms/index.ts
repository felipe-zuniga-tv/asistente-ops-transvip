"use server";

import type {
    OperationsFormQuestion,
    CreateOperationsFormQuestionInput,
    UpdateOperationsFormQuestionInput,
    OperationsFormResponses,
    CreateOperationsFormInput,
    OperationsFormAnswer,
    CreateOperationsFormAnswerInput,
    OperationsForm,
    OperationsFormSection,
    UpdateOperationsFormInput,
    CreateOperationsFormSectionInput,
    UpdateOperationsFormSectionInput,
} from "@/lib/types/vehicle/forms";
import { getSupabaseClient } from "@/lib/database/actions";

// Forms Management
export async function getForms() {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as OperationsForm[];
}

export async function getFormById(id: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .select(`
            *,
            sections:operations_forms_sections(
                *,
                questions:operations_forms_questions(*)
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as OperationsForm & {
        sections: (OperationsFormSection & {
            questions: OperationsFormQuestion[];
        })[];
    };
}

export async function createOperationsForm(input: CreateOperationsFormInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .insert({ ...input, is_active: true })
        .select()
        .single();

    if (error) throw error;
    return data as OperationsForm;
}

export async function updateOperationsForm(id: string, input: UpdateOperationsFormInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsForm;
}

export async function getFormSections(formId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_sections")
        .select("*")
        .eq("form_id", formId)
        .order("order");

    if (error) throw error;
    return data as OperationsFormSection[];
}

export async function createSection(input: CreateOperationsFormSectionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_sections")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormSection;
}

export async function updateSection(id: string, input: UpdateOperationsFormSectionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_sections")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormSection;
}

export async function deleteSection(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("operations_forms_sections")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function createQuestion(input: CreateOperationsFormQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormQuestion;
}

export async function updateQuestion(id: string, input: UpdateOperationsFormQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormQuestion;
}

export async function deleteQuestion(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("operations_forms_questions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function getSectionQuestions(sectionId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .select("*")
        .eq("section_id", sectionId)
        .order("order");

    if (error) throw error;
    return data as OperationsFormQuestion[];
} 

// Question Management
export async function getInspectionQuestions(sectionId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .select("*")
        .eq("section_id", sectionId)
        .order("order");

    if (error) throw error;
    return data as OperationsFormQuestion[];
}

export async function createInspectionQuestion(input: CreateOperationsFormQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .insert({ ...input, is_active: true })
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormQuestion;
}

export async function updateInspectionQuestion(id: string, input: UpdateOperationsFormQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormQuestion;
}

export async function deleteInspectionQuestion(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("operations_forms_questions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

// Inspection Management
export async function getVehicleInspections(vehicleNumber: number) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .select(`
            *,
            form:vehicle_inspection_forms(*)
        `)
        .eq("vehicle_number", vehicleNumber)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (OperationsFormResponses & { form: OperationsForm })[];
}

export async function getInspection(id: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .select(`
            *,
            form:operations_forms(
                *,
                sections:operations_forms_sections(
                    *,
                    questions:operations_forms_questions(*)
                )
            ),
            answers:operations_forms_answers(*)
        `)
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as OperationsFormResponses & {
        form: OperationsForm & {
            sections: (OperationsFormSection & {
                questions: OperationsFormQuestion[];
            })[];
        };
        answers: OperationsFormAnswer[];
    };
}

export async function createInspection(input: CreateOperationsFormInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .insert({ ...input, status: "draft" })
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormResponses;
}

export async function updateInspectionStatus(id: string, status: "draft" | "completed") {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .update({
            status,
            completed_at: status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormResponses;
}

// Answer Management
export async function saveOperationsFormAnswer(input: CreateOperationsFormAnswerInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_answers")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormAnswer;
}

export async function updateOperationsFormAnswer(id: string, answer: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("operations_forms_answers")
        .update({ answer })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormAnswer;
} 