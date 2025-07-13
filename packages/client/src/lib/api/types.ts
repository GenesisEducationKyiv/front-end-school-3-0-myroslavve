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

export type SortFieldOption = "title" | "artist" | "album" | "createdAt";
export type SortOrderOption = "asc" | "desc";

export const mapSortField: Record<SortFieldOption, SortField> = {
    title: SortField.TITLE,
    artist: SortField.ARTIST,
    album: SortField.ALBUM,
    createdAt: SortField.CREATED_AT
};

export const mapSortOrder: Record<SortOrderOption, SortOrder> = {
  asc: SortOrder.ASC,
  desc: SortOrder.DESC
};