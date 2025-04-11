/**
 * Removes markdown code block indicators from a string
 * Useful for cleaning AI-generated responses that contain markdown formatting
 */
export function cleanMarkdownCodeBlocks(text: string): string {
  return text
    .replaceAll('```json\n', '')
    .replaceAll('```\n', '')
    .replaceAll('```', '')
} 