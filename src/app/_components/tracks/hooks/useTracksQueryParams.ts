import useQueryParams from "./useQueryParams";
import * as Belt from "@mobily/ts-belt";

const queryParams = ["page", "limit", "sort", "order", "search", "genre"] as const;
const sortOptions = ["title", "artist", "album", "createdAt"] as const;
const orderOptions = ["asc", "desc"] as const;
type SortParameter = (typeof sortOptions)[number];
type OrderParameter = (typeof orderOptions)[number];

const paramDefaults = {
    page: 1,
    limit: 10,
    sort: "createdAt" as SortParameter,
    order: "desc" as OrderParameter,
    search: "",
    genre: "All"
}

const isSortParameter = (param: string): param is SortParameter => {
    return sortOptions.includes(param as SortParameter);
}

const isOrderParameter = (param: string): param is OrderParameter => {
    return orderOptions.includes(param as OrderParameter);
}

const useTracksQueryParams = () => {
    const { setParam, params } = useQueryParams(queryParams);

    const page = Belt.pipe(
        params.page,
        Belt.O.flatMap((p) => !isNaN(Number(p)) ? Belt.O.Some(Number(p)) : Belt.O.None),
        Belt.O.getWithDefault(paramDefaults.page),
    );
    const limit = Belt.pipe(
        params.limit,
        Belt.O.flatMap((p) => !isNaN(Number(p)) ? Belt.O.Some(p) : Belt.O.None),
        Belt.O.map((p) => Number(p)),
        Belt.O.getWithDefault(paramDefaults.limit)
    );
    const sort = Belt.pipe(
        params.sort,
        Belt.O.flatMap((p) => isSortParameter(p) ? Belt.O.Some(p) : Belt.O.None),
        Belt.O.getWithDefault(paramDefaults.sort)
    );
    const order = Belt.pipe(
        params.order,
        Belt.O.flatMap((p) => isOrderParameter(p) ? Belt.O.Some(p) : Belt.O.None),
        Belt.O.getWithDefault(paramDefaults.order)
    );
    const search = Belt.pipe(
        params.search,
        Belt.O.getWithDefault(paramDefaults.search)
    );
    const genre = Belt.pipe(
        params.genre,
        Belt.O.getWithDefault(paramDefaults.genre)
    );

    return { setParam, page, limit, sort, order, search, genre };
};

export default useTracksQueryParams;