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