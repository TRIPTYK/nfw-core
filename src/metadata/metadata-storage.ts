import { NextFunction, Request, Response } from "express";
import { BaseErrorMiddleware, BaseJsonApiSerializer, BaseMiddleware, BaseSerializerSchema, Constructor, BaseJsonApiModel, BaseJsonApiRepository, ErrorMiddlewareInterface, BaseController } from "..";
import { GuardInterface } from "../interfaces/guard.interface";
import { ResponseHandlerInterface } from "../interfaces/response-handler.interface";

export type RequestMethods = 
        | "get"
        | "post"
        | "delete"
        | "options"
        | "put"
        | "patch";

export interface SerializersMetadataArgs {
    target: Constructor<BaseJsonApiSerializer<unknown>>;
    entity: Constructor<BaseJsonApiModel<unknown>>;
    name: string;
    softDelete: boolean;
}

export interface EntitiesMetadataArgs {
    target: Constructor<BaseJsonApiModel<unknown>>
    name: string;
}

export interface EntityRepositoriesMetadataArgs {
    entity: Constructor<BaseJsonApiModel<unknown>>;
    target: Constructor<BaseJsonApiRepository<unknown>>;
}

export interface ControllerRoutesMetadataArgs {
    property: string;
    path: string;
    target: Constructor<unknown>;
    method: RequestMethods
}

export interface RouteMiddlewareOverridesMedataArgs {
    /**
     * The controller
     */
    target: Constructor<BaseJsonApiModel<unknown>>,
    /**
     * The route
     */
    property: string;
    /**
     * The middleware to override
     */
    middlewareClass: Constructor<BaseMiddleware>
}

export interface ControllersMetadataArgs {
    target: Constructor<unknown>;
    type: "json-api" | "classic";
    entity?: Constructor<BaseJsonApiModel<unknown>>
    routeName?: string;
    generated?: boolean;
}

export interface ServicesMetadataArgs {
    target: Constructor<unknown>;
}

export interface UseMiddlewaresMetadataArgs {
    target: Constructor<unknown>;
    middleware: Constructor<BaseMiddleware | BaseErrorMiddleware> | ((req: Request,res: Response,next: NextFunction) => unknown);
    level: "controller" | "route" | "application";
    priority: number;
    args: unknown;
    property?: string;
}

export interface UseGuardsMetadataArgs {
    target: Constructor<BaseController>;
    guard: Constructor<GuardInterface>;
    args?: unknown;
    propertyName?: string;
}

export interface MiddlewaresMetadataArgs {
    target: Constructor<BaseMiddleware | BaseErrorMiddleware>
}

export interface SerializerSchemaColumnsMetadataArgs {
    target: Constructor<BaseSerializerSchema<unknown>>;
    column: string;
    type: "serialize" | "deserialize";
}

export interface SerializerSchemaRelationMetadataArgs {
    target: Constructor<BaseSerializerSchema<unknown>>;
    column: string;
    relation: () => Constructor<unknown>
}

export interface SerializerSchemaMetadataArgs {
    target: Constructor<BaseSerializerSchema<unknown>>;
    entity?: Constructor<BaseJsonApiSerializer<unknown>>;
}

export interface UseParamsMetadataArgs {
    target: Constructor<BaseController>;
    property: string;
    parameterIndex: number;
    type : "request" | "body" | "params" | "param";
    args?: unknown[];
}

export interface UseResponseHandlerMetadataArgs {
    target: Constructor<BaseController>;
    responseHandler: Constructor<ResponseHandlerInterface>;
    args?: unknown;
    propertyName?: string;
}

export class MetadataStorage {
    public static instance: MetadataStorage;

    public useResponseHandlers: UseResponseHandlerMetadataArgs[] = [];
    public useParams: UseParamsMetadataArgs[] = [];
    public useGuards: UseGuardsMetadataArgs[] = [];
    public entities: EntitiesMetadataArgs[] = [];
    public repositories: EntityRepositoriesMetadataArgs[] = [];
    public controllers: ControllersMetadataArgs[] = [];
    public controllerRoutes: ControllerRoutesMetadataArgs[] = [];
    public services: ServicesMetadataArgs[] = [];
    public useMiddlewares: UseMiddlewaresMetadataArgs[] = [];
    public serializers: SerializersMetadataArgs[] = [];
    public middlewareOverrides: RouteMiddlewareOverridesMedataArgs[] = [];
    public middlewares: MiddlewaresMetadataArgs[] = [];
    public serializerSchemas: SerializerSchemaMetadataArgs[] = [];
    public serializerSchemaColumns: SerializerSchemaColumnsMetadataArgs[] = [];
    public serializerSchemaRelations: SerializerSchemaRelationMetadataArgs[] = [];
}

export function getMetadataStorage() {
    if (MetadataStorage.instance) {
        return MetadataStorage.instance;
    }
    return MetadataStorage.instance = new MetadataStorage();
}