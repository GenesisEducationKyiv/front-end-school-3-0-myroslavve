import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import * as Belt from "@mobily/ts-belt";

const useQueryParams = <Params extends readonly string[]>(paramsList: Params) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params: Record<Params[number], Belt.Option<string>> =
    Object.fromEntries(
      paramsList.map((param) => [param, Belt.O.fromNullable(searchParams.get(param))])
    ) as Record<Params[number], Belt.Option<string>>;

  const createQueryString = useCallback(
    (name: Params[number], value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const setParam = useCallback(
    (name: Params[number], value: string) => {
      router.push(`${pathname}?${createQueryString(name, value)}`);
    },
    [pathname, createQueryString, router]
  );

  return { setParam, params };
};

export default useQueryParams;
