import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(fullName: string): string {
  const names = fullName.split(" ");
  const initials = names.slice(0, 2).map(name => name.charAt(0).toUpperCase()).join("");
  return initials || "N/A"; // Fallback if no initials are found
} 