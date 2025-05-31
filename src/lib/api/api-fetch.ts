import { z } from 'zod';
import { API_URL } from "@/constants";

interface ApiFetchOptions<T> {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: object | FormData | null;
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
    isFormData?: boolean;
}

export async function apiFetch<T>(
    endpoint: string, 
    options: ApiFetchOptions<T> = {}
): Promise<T> {
    const {
        method = 'GET',
        body,
        headers = {},
        schema,
        isFormData = false
    } = options;

    const defaultHeaders: Record<string, string> = {};
    if (!isFormData && body) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    let requestBody: string | FormData | undefined;
    if (body) {
        requestBody = isFormData ? body as FormData : JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: requestBody,
    });

    if (response.status === 204 || method === 'DELETE' && response.ok) {
        return undefined as T;
    }

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.error || `Failed to ${method.toLowerCase()} ${endpoint}`);
    }

    if (schema) {
        return schema.parse(json);
    }

    return json;
} 