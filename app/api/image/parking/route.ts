import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from 'ai';
import { TICKET_OCR_SYSTEM_MESSAGE } from "@/lib/config/finance";

const MODEL_NAME = 'gpt-4o'

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
                    model: openai(MODEL_NAME),
                    system: TICKET_OCR_SYSTEM_MESSAGE,
                    messages: [
                        {
                            role: "user",
                            content: [{
                                type: "image",
                                image: `${base64Image}`,
                            }]
                        }
                    ]
                })

                return result.text
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
