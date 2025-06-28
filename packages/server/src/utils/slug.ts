/**
 * Convert a string to kebab-case for use as a URL-friendly slug
 * 
 * @param text The string to convert to a slug
 * @returns A URL-friendly kebab-case string
 * @example
 * createSlug("Hello World!") // "hello-world"
 * createSlug("My Awesome Track - 2023") // "my-awesome-track-2023"
 */
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};