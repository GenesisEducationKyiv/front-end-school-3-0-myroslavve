import { debounce, isValidImageUrl } from '../utils';

describe('debounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should delay function execution', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 500);

        // Call the debounced function
        debouncedFn();

        // Function should not be called immediately
        expect(mockFn).not.toHaveBeenCalled();

        // Fast-forward time
        jest.advanceTimersByTime(499);
        expect(mockFn).not.toHaveBeenCalled();

        jest.advanceTimersByTime(1);
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should only execute once when called multiple times within wait period', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 500);

        // Call the debounced function multiple times
        debouncedFn();
        debouncedFn();
        debouncedFn();

        // Fast-forward time
        jest.advanceTimersByTime(500);

        // Function should only be called once
        expect(mockFn).toHaveBeenCalledTimes(1);
    });

    test('should pass arguments to the debounced function', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 500);

        // Call with arguments
        debouncedFn(1, 'test', { key: 'value' });

        // Fast-forward time
        jest.advanceTimersByTime(500);

        // Check if arguments were passed correctly
        expect(mockFn).toHaveBeenCalledWith(1, 'test', { key: 'value' });
    });

    test('should reset timer on subsequent calls', () => {
        const mockFn = jest.fn();
        const debouncedFn = debounce(mockFn, 500);

        // Call the debounced function
        debouncedFn();

        // Fast-forward time partially
        jest.advanceTimersByTime(300);

        // Call again before the first call executes
        debouncedFn();

        // Fast-forward time to just after the first call would have executed
        jest.advanceTimersByTime(300);

        // Function should not have been called yet (timer was reset)
        expect(mockFn).not.toHaveBeenCalled();

        // Advance the remaining time
        jest.advanceTimersByTime(200);

        // Function should now be called once
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