
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Create a username from an email address
 * Takes the part before the @ symbol and removes any invalid characters
 */
export function usernameFromEmail(email: string): string {
  if (!email) return '';
  
  // Get the part before @
  const username = email.split('@')[0];
  
  // Remove any characters that aren't letters, numbers, or underscores
  return username.replace(/[^a-zA-Z0-9_]/g, '');
}
