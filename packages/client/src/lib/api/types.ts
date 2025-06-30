import { SortField } from "@music-app/common";
import { SortOrder } from "@music-app/common";
import { z } from "zod";

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE';

export interface ApiFetchOptions<T> {
    method?: HttpMethod;
    body?: object | FormData | null;
    headers?: Record<string, string>;
    schema?: z.ZodSchema<T>;
}

export const mapSortField: Record<string, SortField> = {
    title: SortField.TITLE,
    artist: SortField.ARTIST,
    album: SortField.ALBUM,
    createdAt: SortField.CREATED_AT
};

export const mapSortOrder: Record<string, SortOrder> = {
  asc: SortOrder.ASC,
  desc: SortOrder.DESC
};