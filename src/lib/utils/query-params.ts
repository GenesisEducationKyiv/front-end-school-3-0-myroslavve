import { ReadonlyURLSearchParams } from "next/navigation";
import * as Belt from "@mobily/ts-belt";

export const createParamsObject = <Params extends readonly string[]>(
  paramsList: Params,
  searchParams: ReadonlyURLSearchParams
): Record<Params[number], Belt.Option<string>> => {
  return Object.fromEntries(
    paramsList.map((param) => [param, Belt.O.fromNullable(searchParams.get(param))])
  ) as Record<Params[number], Belt.Option<string>>;
}; 