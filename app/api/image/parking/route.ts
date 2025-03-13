import { NextRequest } from "next/server";
import { generateText } from 'ai';
import { google } from "@ai-sdk/google";
import { TICKET_OCR_SYSTEM_MESSAGE } from "@/lib/core/config/finance";

const GOOGLE_MODEL_NAME = 'gemini-2.0-flash-exp'

export async function POST(request: NextRequest) {
    try {        
        const formData = await request.formData()
        const files = formData.getAll('files') as File[];

        if (!files.length) {
            return Response.json(
                { error: "No files provided" },
                { status: 400 }
            );
        }

        const results = await Promise.all(
            files.map(async (file) => {
                // Convert file to base64
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64Image = buffer.toString('base64');

                // Call OpenAI API
                const result = await generateText({
                    model: google(GOOGLE_MODEL_NAME),
                    system: TICKET_OCR_SYSTEM_MESSAGE,
                    messages: [
                        {
                            role: "user",
                            content: [
                                {
                                    type: "text",
                                    text: `Estoy enviando ${files.length} imágenes de tickets de estacionamiento para que puedas parsear.`,
                                },
                                {
                                    type: "image",
                                    image: base64Image,
                                }
                            ]
                        }
                    ]
                })

                const text_response = result.text.replaceAll('```json\n', '').replaceAll('```\n', '')
                return text_response
            })
        );

        return Response.json({ results });

    } catch (error) {
        console.error("API Error:", error);
        return Response.json(
            { error: "Failed to process images" },
            { status: 500 }
        );
    }
}
