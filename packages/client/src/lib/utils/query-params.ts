import { ReadonlyURLSearchParams } from "next/navigation";
import * as Belt from "@mobily/ts-belt";
import { mapSortField, mapSortOrder, SortFieldOption, SortOrderOption } from "../api/types";
import { SortField, SortOrder } from "@music-app/common";

export const createParamsObject = <Params extends readonly string[]>(
  paramsList: Params,
  searchParams: ReadonlyURLSearchParams
): Record<Params[number], Belt.Option<string>> => {
  return Object.fromEntries(
    paramsList.map((param) => [param, Belt.O.fromNullable(searchParams.get(param))])
  ) as Record<Params[number], Belt.Option<string>>;
}; 

export const getSortField = (sort: SortFieldOption | undefined): SortField => {
  if (!sort) {
    return SortField.UNSPECIFIED;
  }

  return mapSortField[sort];
};

export const getSortOrder = (order: SortOrderOption | undefined): SortOrder => {
  if (!order) {
    return SortOrder.UNSPECIFIED;
  }

  return mapSortOrder[order];
};