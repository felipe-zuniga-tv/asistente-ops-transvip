"use server";

import type {
    InspectionForm,
    CreateInspectionFormInput,
    UpdateInspectionFormInput,
    InspectionSection,
    CreateInspectionSectionInput,
    UpdateInspectionSectionInput,
    InspectionQuestion,
    CreateInspectionQuestionInput,
    UpdateInspectionQuestionInput,
} from "@/lib/types/vehicle/inspection";
import { getSupabaseClient } from "@/lib/database/actions";

export async function getInspectionForms() {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_forms")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as InspectionForm[];
}

export async function getInspectionForm(id: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_forms")
        .select(`
            *,
            sections:vehicle_inspection_sections(
                *,
                questions:vehicle_inspection_questions(*)
            )
        `)
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as InspectionForm & {
        sections: (InspectionSection & {
            questions: InspectionQuestion[];
        })[];
    };
}

export async function createInspectionForm(input: CreateInspectionFormInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_forms")
        .insert({ ...input, is_active: true })
        .select()
        .single();

    if (error) throw error;
    return data as InspectionForm;
}

export async function updateInspectionForm(id: string, input: UpdateInspectionFormInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_forms")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionForm;
}

export async function getFormSections(formId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_sections")
        .select("*")
        .eq("form_id", formId)
        .order("order");

    if (error) throw error;
    return data as InspectionSection[];
}

export async function createSection(input: CreateInspectionSectionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_sections")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionSection;
}

export async function updateSection(id: string, input: UpdateInspectionSectionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_sections")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionSection;
}

export async function deleteSection(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("vehicle_inspection_sections")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function createQuestion(input: CreateInspectionQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_questions")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionQuestion;
}

export async function updateQuestion(id: string, input: UpdateInspectionQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_questions")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionQuestion;
}

export async function deleteQuestion(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("vehicle_inspection_questions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function getSectionQuestions(sectionId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_questions")
        .select("*")
        .eq("section_id", sectionId)
        .order("order");

    if (error) throw error;
    return data as InspectionQuestion[];
} 