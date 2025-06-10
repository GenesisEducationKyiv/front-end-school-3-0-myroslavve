import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { createParamsObject } from "@/lib/utils/query-params";

const useQueryParams = <Params extends readonly string[]>(paramsList: Params) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = createParamsObject(paramsList, searchParams);

  const createQueryString = useCallback(
    (name: Params[number], value: string) => {
      const params = new URLSearchParams(searchParams);
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
