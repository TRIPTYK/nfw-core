export interface BaseSerializerSchemaInterface<T> {
    baseUrl: string;
    links(data: T, extraData: any, type: string): {
        self?: string;
        related?: string;
    };
    relationshipLinks(data: T, extraData: any, type: string, relationshipName: string): {
        self?: string;
        related?: string;
    };
    relationshipMeta(data: T, extraData: any, type: string, relationshipName: string): any;
    meta(data: T, extraData: any, type: string): any;
}
export declare abstract class BaseSerializerSchema<T> implements BaseSerializerSchemaInterface<T> {
    get baseUrl(): string;
    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage: (url: string, newPage: number) => string;
    topLevelLinks(data: any, extraData: any, type: any): {
        first: string;
        last: string;
        prev: string;
        next: string;
        self: string;
    } | {
        self: string;
        first?: undefined;
        last?: undefined;
        prev?: undefined;
        next?: undefined;
    };
    links(data: any, extraData: any, type: any): {
        self: string;
    };
    relationshipLinks(data: any, extraData: any, type: any, relationshipName: any): {
        self: string;
        related: string;
    };
    meta(data: T, extraData: any, type: string): void;
    relationshipMeta(data: T, extraData: any, type: string, relationshipName: any): void;
}
