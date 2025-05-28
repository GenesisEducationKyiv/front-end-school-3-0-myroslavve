import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 */
export function debounce<T extends (...args: any[]) => unknown>(func: T, wait: number) {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Validates if a given URL is a valid image URL.
 * 
 * @param url The URL to validate
 * @returns True if the URL is a valid image URL, false otherwise
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname.toLowerCase();
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/.test(pathname);
  } catch {
    return false;
  }
};