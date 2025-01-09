'use server'

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { CREATE_TEXT_PROMPT, EMAIL_TEXT_OPS_EXAMPLE, SYSTEM_MESSAGE } from "../config/chat"

const modelInstance = google('gemini-2.0-flash-exp')

export async function createText({ subject }: {
    subject: string
}) {
    // Create text response
    const { text, finishReason, usage } = await generateText({
        model: modelInstance,
        system: SYSTEM_MESSAGE + "\n\n" + CREATE_TEXT_PROMPT(EMAIL_TEXT_OPS_EXAMPLE, subject),
        messages: [{
            role: 'assistant',
            content: `Redactando un texto para el usuario...`
        }],
    })

    return { text, finishReason, usage };
}
