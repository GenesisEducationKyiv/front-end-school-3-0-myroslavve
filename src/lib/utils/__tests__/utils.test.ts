import { vi, describe, beforeEach, afterEach, test, expect } from 'vitest';
import { debounce } from '../input';
import { isValidImageUrl } from '../image';

describe('debounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('should delay function execution', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 500);

        debouncedFn();

        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(499);
        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(1);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should only execute once when called multiple times within wait period', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 500);

        debouncedFn();
        debouncedFn();
        debouncedFn();

        vi.advanceTimersByTime(500);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass arguments to the debounced function', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 500);

        debouncedFn(1, 'test', { key: 'value' });

        vi.advanceTimersByTime(500);

        expect(mockFn).toHaveBeenCalledWith(1, 'test', { key: 'value' });
    });

    test('should reset timer on subsequent calls', () => {
        const mockFn = vi.fn();
        const debouncedFn = debounce(mockFn, 500);

        debouncedFn();

        vi.advanceTimersByTime(300);

        debouncedFn();

        vi.advanceTimersByTime(300);

        expect(mockFn).not.toHaveBeenCalled();

        vi.advanceTimersByTime(200);

        expect(mockFn).toHaveBeenCalledTimes(1);
    });
});

describe('isValidImageUrl', () => {
    test('should return true for valid image URLs', () => {
        expect(isValidImageUrl('https://example.com/image.jpg')).toBe(true);
        expect(isValidImageUrl('http://example.com/path/to/image.png')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.jpeg')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.gif')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.bmp')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.webp')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.svg')).toBe(true);
    });

    test('should return true for URLs with query parameters and hash fragments', () => {
        expect(isValidImageUrl('https://example.com/image.jpg?width=100&height=100')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.png#fragment')).toBe(true);
    });

    test('should return true for URLs with uppercase extensions', () => {
        expect(isValidImageUrl('https://example.com/image.JPG')).toBe(true);
        expect(isValidImageUrl('https://example.com/image.PNG')).toBe(true);
    });

    test('should return false for non-image URLs', () => {
        expect(isValidImageUrl('https://example.com/document.pdf')).toBe(false);
        expect(isValidImageUrl('https://example.com/video.mp4')).toBe(false);
        expect(isValidImageUrl('https://example.com/page.html')).toBe(false);
        expect(isValidImageUrl('https://example.com/')).toBe(false);
    });

    test('should return false for invalid URLs', () => {
        expect(isValidImageUrl('not-a-url')).toBe(false);
        expect(isValidImageUrl('')).toBe(false);
        expect(isValidImageUrl('example.com/image.jpg')).toBe(false);
    });
}); 