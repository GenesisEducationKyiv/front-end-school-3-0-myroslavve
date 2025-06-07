import { z } from "zod";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';

export interface ApiFetchOptions<T> {
    method?: HttpMethod;
    body?: object | FormData | null;
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
}