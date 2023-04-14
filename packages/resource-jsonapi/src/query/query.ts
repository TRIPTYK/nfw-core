export interface IncludeQuery { relationName: string; nested: IncludeQuery[] }

export interface SortQuery {
    [key: string]: 'ASC' | 'DESC' | SortQuery,
}

export type FilterQuery = {
    [key:string]: string,
}

export interface PageQuery {
    number: number,
    size: number,
}

export interface JsonApiQuery {
    fields?: Record<string, string[]>,
    include?: IncludeQuery[],
    sort?: SortQuery,
    filter?: FilterQuery,
    page?: PageQuery,
}
