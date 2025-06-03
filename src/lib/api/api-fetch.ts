import { API_URL } from "@/constants";
import { ApiFetchOptions } from "./types";

export async function apiFetch<T>(
    endpoint: string, 
    options: ApiFetchOptions<T> = {}
): Promise<T> {
    const {
        method = 'GET',
        body,
        headers = {},
        schema,
    } = options;

    const defaultHeaders: Record<string, string> = {};
    if (body && !(body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
    }

    let requestBody: string | FormData | undefined;
    if (body) {
        requestBody = body instanceof FormData ? body : JSON.stringify(body);
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