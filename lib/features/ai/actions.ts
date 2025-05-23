'use server'

import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { CREATE_TEXT_PROMPT, EMAIL_TEXT_OPS_EXAMPLE, SYSTEM_MESSAGE } from "@/lib/core/config"

// Model with the lowest latency and cost
const modelInstance = google('gemini-2.0-flash-lite')

export async function createText({ objective, fleetTypes, vehicleTypes, referenceText, writingStyle, variations }: {
    objective: string
    fleetTypes?: string[]
    vehicleTypes?: string[]
    referenceText: string
    writingStyle: string
    variations?: number
}) {
    let systemMessage = [
        SYSTEM_MESSAGE,
        "\n",
        CREATE_TEXT_PROMPT(
            variations || 1,
            writingStyle,
            objective,
            referenceText || EMAIL_TEXT_OPS_EXAMPLE, 
        )
    ].join("\n")

    // Create text response
    const { text, finishReason, usage } = await generateText({
        model: modelInstance,
        system: systemMessage,
        messages: [{
            role: 'assistant',
            content: `Redactando un texto para el usuario...`
        }],
    })

    return { text, finishReason, usage };
} 