'use server'

import { revalidatePath } from 'next/cache'
import { Routes } from '@/utils/routes'
import { getSupabaseClient } from '../database/actions'

interface ReorderSectionsInput {
    sections: {
        id: string
        order: number
    }[]
}

export async function reorderSections(formId: string, input: ReorderSectionsInput) {
    const supabase = await getSupabaseClient()

    try {
        // Update all sections in a transaction
        const { error } = await supabase.rpc('reorder_form_sections', {
            p_sections: input.sections,
            p_form_id: formId
        })

        if (error) throw error

        revalidatePath(Routes.ADMIN.FORMS_CONFIG)
        revalidatePath(`${Routes.ADMIN.FORMS_CONFIG}/${formId}`)

        return { success: true }
    } catch (error) {
        console.error('Error reordering sections:', error)
        return { success: false, error }
    }
}

interface ReorderQuestionsInput {
    questions: {
        id: string;
        order: number;
    }[];
}

export async function reorderQuestions(sectionId: string, input: ReorderQuestionsInput) {
    try {
        const { questions } = input;
        const supabase = await getSupabaseClient();

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