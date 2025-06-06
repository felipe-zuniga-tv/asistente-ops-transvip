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
    CreateOperationsFormResponseInput,
} from "@/types/domain/forms/types";
import { createClient } from "@/lib/supabase/server";
import type { ReorderSectionsInput, ReorderQuestionsInput } from '@/types/domain/forms/types';

// Forms Management
export async function getOperationsForms() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data as OperationsForm[];
}

export async function getOperationsFormById(id: string) {
    const supabase = await createClient();

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
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms")
        .insert({ ...input, is_active: true })
        .select()
        .single();

    if (error) throw error;
    return data as OperationsForm;
}

export async function updateOperationsForm(id: string, input: UpdateOperationsFormInput) {
    const supabase = await createClient();

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
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_sections")
        .select("*")
        .eq("form_id", formId)
        .order("order");

    if (error) throw error;
    return data as OperationsFormSection[];
}

export async function createSection(input: CreateOperationsFormSectionInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_sections")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormSection;
}

export async function updateSection(id: string, input: UpdateOperationsFormSectionInput) {
    const supabase = await createClient();

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
    const supabase = await createClient();

    const { error } = await supabase
        .from("operations_forms_sections")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function createQuestion(input: CreateOperationsFormQuestionInput) {
    const supabase = await createClient();
    const { options, ...questionData } = input;

    const { data: question, error: questionError } = await supabase
        .from("operations_forms_questions")
        .insert({
            ...questionData,
        })
        .select()
        .single();

    if (questionError) throw questionError;

    if (options && options.length > 0) {
        const { error: optionsError } = await supabase
            .from("operations_form_question_options")
            .insert(
                options.map((option) => ({
                    question_id: question.id,
                    label: option.label,
                    order_number: option.order,
                }))
            );

        if (optionsError) throw optionsError;
    }

    return question as OperationsFormQuestion;
}

export async function updateQuestion(id: string, input: UpdateOperationsFormQuestionInput) {
    const supabase = await createClient();
    const { options, ...questionData } = input;

    const { data: question, error: questionError } = await supabase
        .from("operations_forms_questions")
        .update({
            ...questionData,
        })
        .eq("id", id)
        .select()
        .single();

    if (questionError) throw questionError;

    if (options) {
        // Delete existing options
        const { error: deleteError } = await supabase
            .from("operations_form_question_options")
            .delete()
            .eq("question_id", id);

        if (deleteError) throw deleteError;

        // Insert new options if any
        if (options.length > 0) {
            const { error: optionsError } = await supabase
                .from("operations_form_question_options")
                .insert(
                    options.map((option) => ({
                        question_id: id,
                        label: option.label,
                        order_number: option.order,
                    }))
                );

            if (optionsError) throw optionsError;
        }
    }

    return question as OperationsFormQuestion;
}

export async function deleteQuestion(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("operations_forms_questions")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function getSectionQuestions(sectionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_questions")
        .select(`
            *,
            options:operations_form_question_options(*)
        `)
        .eq("section_id", sectionId)
        .order("order");

    if (error) throw error;
    return data as OperationsFormQuestion[];
}

// Response Management
export async function createFormResponse(input: CreateOperationsFormResponseInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_responses")
        .insert({
            id: input.id,
            form_id: input.form_id,
            status: 'draft'
        })
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormResponses;
}

export async function updateFormResponse(id: string, input: { status: 'draft' | 'completed', completed_at?: string }) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_responses")
        .update(input)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormResponses;
}

// Answer Management
export async function saveOperationsFormAnswer(input: CreateOperationsFormAnswerInput) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_answers")
        .insert(input)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormAnswer;
}

export async function updateOperationsFormAnswer(id: string, answer: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_answers")
        .update({ answer })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data as OperationsFormAnswer;
}

export async function updateInspectionStatus(id: string, status: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("operations_forms_inspections")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Section Ordering
export async function reorderSections(formId: string, input: ReorderSectionsInput) {
    const supabase = await createClient()

    try {
        // Update all sections in a transaction
        const { error } = await supabase.rpc('reorder_form_sections', {
            p_sections: input.sections,
            p_form_id: formId
        })

        if (error) throw error

        return { success: true }
    } catch (error) {
        console.error('Error reordering sections:', error)
        return { success: false, error }
    }
}

export async function reorderQuestions(sectionId: string, input: ReorderQuestionsInput) {
    try {
        const { questions } = input;
        const supabase = await createClient();

        // Update each question's order
        const promises = questions.map(({ id, order }) =>
            supabase
                .from('operations_form_questions')
                .update({ order })
                .eq('id', id)
        );

        await Promise.all(promises);

        return { success: true };
    } catch (error) {
        console.error('Error reordering questions:', error);
        return { success: false };
    }
} 