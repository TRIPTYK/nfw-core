import * as JSONAPISerializer from "json-api-serializer";
import { SerializerInterface } from "../interfaces/serializer.interface";
import { Constructor } from "../types/global";
import { BaseSerializerSchema } from "./base.serializer-schema";
export declare type SerializerParams = {
    pagination?: PaginationParams;
};
export declare type PaginationParams = {
    total: number;
    page: number;
    size: number;
    url: string;
};
export declare abstract class BaseJsonApiSerializer<T> implements SerializerInterface<T> {
    static whitelist: string[];
    type: string;
    serializer: JSONAPISerializer;
    constructor();
    init(): void;
    serialize(payload: T | T[], schema: string, extraData?: any): any;
    pagination(payload: T | T[], schema: string, extraData?: PaginationParams): any;
    deserialize(payload: any): T | T[];
    private applyDeserializeCase;
    getSchema(name: string): Constructor<BaseSerializerSchema<any>>;
    convertSerializerSchemaToObjectSchema(schema: Constructor<BaseSerializerSchema<T>>, rootSchema: Constructor<BaseSerializerSchema<T>>, schemaName: string, passedBy: string[]): void;
}
