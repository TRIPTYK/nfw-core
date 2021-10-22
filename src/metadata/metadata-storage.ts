import { BaseErrorMiddleware, BaseJsonApiSerializer, BaseMiddleware, BaseSerializerSchema, Constructor, BaseJsonApiModel, BaseJsonApiRepository, ErrorMiddlewareInterface } from "..";

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
    middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>;
    level: "controller" | "route" | "application";
    priority: number;
    args: unknown;
    property?: string;
    type: "error" | "classic";
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

export class MetadataStorage {
    public static instance: MetadataStorage;

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