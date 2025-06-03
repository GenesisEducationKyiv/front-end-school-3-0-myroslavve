import { AnyFunction } from "./types";

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param func The function to debounce
 * @param wait The number of milliseconds to delay
 */
export function debounce<T extends AnyFunction>(func: T, wait: number) {
    let timeout: NodeJS.Timeout | undefined;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  