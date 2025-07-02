import { API_URL } from "@/constants";
import { ApiFetchOptions } from "./types";
import { ok, err, Result } from "neverthrow";

export async function apiFetch<T>(
    endpoint: string, 
    options: ApiFetchOptions<T> = {}
): Promise<Result<T, Error>> {
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

    let response: Response;
    let json: any;

    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: { ...defaultHeaders, ...headers },
            body: requestBody,
        });
    } catch (error) {
        return err(new Error(error instanceof Error ? error.message : 'Network error occurred'));
    }

    if (response.status === 204 || method === 'DELETE' && response.ok) {
        return ok(undefined as T);
    }

    try {
        json = await response.json();
    } catch (error) {
        return err(new Error('Failed to parse response JSON'));
    }

    if (!response.ok) {
        return err(new Error(json.error || `Failed to ${method.toLowerCase()} ${endpoint}`));
    }

    if (schema) {
        const result = schema.safeParse(json);
        if (result.success) {
            return ok(result.data);
        }
        return err(new Error(result.error.message));
    }

    return ok(json);
} 