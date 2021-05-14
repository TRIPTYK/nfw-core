import { EntityMetadata, Repository, SelectQueryBuilder } from "typeorm";
import { PaginationQueryParams } from "../types/jsonapi";
interface JsonApiRequestParams {
    includes?: string[];
    sort?: string[];
    fields?: Record<string, any>;
    page?: PaginationQueryParams;
    filter?: any;
}
/**
 * Base Repository class , inherited for all current repositories
 */
export declare class BaseJsonApiRepository<T> extends Repository<T> {
    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    jsonApiRequest(params: JsonApiRequestParams, { allowIncludes, allowSorting, allowPagination, allowFields, allowFilters, }?: {
        allowIncludes?: boolean;
        allowSorting?: boolean;
        allowPagination?: boolean;
        allowFields?: boolean;
        allowFilters?: boolean;
    }, parentQueryBuilder?: SelectQueryBuilder<T>): SelectQueryBuilder<T>;
    /**
     *
     * @param req
     * @param serializer
     */
    fetchRelated(relationName: string, id: string | number, params: JsonApiRequestParams): Promise<any>;
    private applyConditionBlock;
    private applyFilter;
    /**
     *
     * @param req
     */
    addRelationshipsFromRequest(relationName: string, id: string | number, body: {
        id: string;
    }[] | {
        id: string;
    }): Promise<any>;
    /**
     *
     * @param req
     */
    updateRelationshipsFromRequest(relationName: string, id: string | number, body: {
        id: string;
    }[] | {
        id: string;
    }): Promise<any>;
    /**
     *
     * @param req
     */
    removeRelationshipsFromRequest(relationName: string, id: string | number, body: {
        id: string;
    }[] | {
        id: string;
    }): Promise<any>;
    handlePagination(qb: SelectQueryBuilder<any>, { number, size }: PaginationQueryParams): void;
    handleSorting(qb: SelectQueryBuilder<any>, sort: string[]): void;
    handleSparseFields(qb: SelectQueryBuilder<T>, props: Record<string, any> | string | any[], parents?: string[], currentSelection?: string[]): string[];
    /**
     * Simplified from TypeORM source code
     */
    handleIncludes(qb: SelectQueryBuilder<any>, allRelations: string[], alias: string, metadata: EntityMetadata, prefix: string): void;
    buildAlias(alias: string, relation: string): any;
    /**
     *
     * @param req
     * @param serializer
     */
    fetchRelationshipsFromRequest(relationName: string, id: string | number, params: JsonApiRequestParams): Promise<any>;
}
export {};
