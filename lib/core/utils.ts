import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

// Utility function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique ID
export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  10
) // 7-character random string

// Vehicle status constants
export const VEHICLE_STATUS = {
  OFFLINE: 0,
  ONLINE: 1,
  ONLINE_BUSY: 1,
  ONLINE_AVAILABLE: 2,
} as const

// Sleep function
export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export const calculateDuration = (entryTime: string) => {
  const entry = new Date(entryTime as string)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - entry.getTime()) / 60000)
  return diffInMinutes
}

export function getInitials(fullName: string): string {
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map(name => name.charAt(0).toUpperCase()).join("");
  return initials || "N/A"; // Fallback if no initials are found
}

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

/**
 * Generates a UUID for use in the chat system
 * This is a simplified implementation - in production, use a proper UUID library
 */
export function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}