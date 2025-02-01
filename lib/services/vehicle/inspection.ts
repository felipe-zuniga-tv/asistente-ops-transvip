"use server";

import type {
    InspectionQuestion,
    CreateInspectionQuestionInput,
    UpdateInspectionQuestionInput,
    VehicleInspection,
    CreateInspectionInput,
    InspectionAnswer,
    CreateInspectionAnswerInput,
    InspectionForm,
    InspectionSection,
} from "@/lib/types/vehicle/inspection";
import { getSupabaseClient } from "@/lib/database/actions";

// Question Management
export async function getInspectionQuestions(sectionId: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_questions")
        .select("*")
        .eq("section_id", sectionId)
        .order("order");

    if (error) throw error;
    return data as InspectionQuestion[];
}

export async function createInspectionQuestion(input: CreateInspectionQuestionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_questions")
        .insert({ ...input, is_active: true })
        .select()
        .single();

    if (error) throw error;
    return data as InspectionQuestion;
}

export async function updateInspectionQuestion(id: string, input: UpdateInspectionQuestionInput) {
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

export async function deleteInspectionQuestion(id: string) {
    const supabase = await getSupabaseClient();

    const { error } = await supabase
        .from("vehicle_inspection_questions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

// Inspection Management
export async function getVehicleInspections(vehicleNumber: number) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspections")
        .select(`
            *,
            form:vehicle_inspection_forms(*)
        `)
        .eq("vehicle_number", vehicleNumber)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as (VehicleInspection & { form: InspectionForm })[];
}

export async function getInspection(id: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspections")
        .select(`
            *,
            form:vehicle_inspection_forms(
                *,
                sections:vehicle_inspection_sections(
                    *,
                    questions:vehicle_inspection_questions(*)
                )
            ),
            answers:vehicle_inspection_answers(*)
        `)
        .eq("id", id)
        .single();

    if (error) throw error;
    return data as VehicleInspection & {
        form: InspectionForm & {
            sections: (InspectionSection & {
                questions: InspectionQuestion[];
            })[];
        };
        answers: InspectionAnswer[];
    };
}

export async function createInspection(input: CreateInspectionInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspections")
        .insert({ ...input, status: "draft" })
        .select()
        .single();

    if (error) throw error;
    return data as VehicleInspection;
}

export async function updateInspectionStatus(id: string, status: "draft" | "completed") {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspections")
        .update({
            status,
            completed_at: status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as VehicleInspection;
}

// Answer Management
export async function createInspectionAnswer(input: CreateInspectionAnswerInput) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_answers")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionAnswer;
}

export async function updateInspectionAnswer(id: string, answer: string) {
    const supabase = await getSupabaseClient();

    const { data, error } = await supabase
        .from("vehicle_inspection_answers")
        .update({ answer })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as InspectionAnswer;
} 