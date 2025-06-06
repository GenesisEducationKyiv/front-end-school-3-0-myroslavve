import { AnyFunction } from "./types";

export function debounce<T extends AnyFunction>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | undefined;
  
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
  