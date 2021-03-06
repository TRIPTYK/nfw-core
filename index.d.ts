/// <reference types="socket.io-client" />
import * as Express from 'express';
import { Request, Response as Response$1, NextFunction } from 'express';
import { ParamSchema, Location, Schema as Schema$1 } from 'express-validator';
import * as typeorm from 'typeorm';
import { DatabaseType, Connection, ConnectionOptions, EntityMetadata, Repository, SelectQueryBuilder, EntityOptions, ColumnOptions } from 'typeorm';
export * from 'typeorm';
import * as JSONAPISerializer from 'json-api-serializer';
import * as typeorm_metadata_types_RelationTypes from 'typeorm/metadata/types/RelationTypes';
import * as ts_morph from 'ts-morph';

interface ControllerInterface {
    init(router: Express.Router): any;
}

declare abstract class BaseController implements ControllerInterface {
    name: string;
    constructor();
    callMethod(methodName: string): any;
    init(): void;
}

interface MiddlewareInterface {
    use(req: Request, res: Response$1, next: (err?: any) => void, args: any): any;
}
interface ErrorMiddlewareInterface {
    use(err: any, req: Request, res: Response$1, next: (err?: any) => void, args: any): any;
}

/**
 * BaseController that handles WebSocket connection.
 */
declare class WsController extends BaseController {
    socket: SocketIOClient.Socket;
    /**
     * @param address Address of the WS server to connect.
     * @param onConnect Function executed on connection.
     * @param callback Function executed when the application registry is running.
     */
    constructor(address: string, onConnect?: () => void, callback?: () => void);
    /**
     * Send a message to the server and wait for a response.
     * @param type Type of request.
     * @param data Complement data to send.
     * @returns Promise of the response as a string.
     */
    protected sendMessageAndWaitResponse(type: string, data?: any): Promise<string>;
}

/**
 * Generates app
 */
declare class GeneratorController extends WsController {
    generateRoute(req: Request, res: Response$1): Promise<void>;
    generateSubRoute(req: Request, res: Response$1): Promise<void>;
    generateEntity(req: Request, res: Response$1): Promise<void>;
    addPermissions(req: Request, res: Response$1): Promise<void>;
    addEntityRelation(req: Request, res: Response$1): Promise<void>;
    generateColumn(req: Request, res: Response$1): Promise<void>;
    do(req: Request, res: Response$1): Promise<void>;
    deleteRoute(req: Request, res: Response$1): Promise<void>;
    deleteSubRoute(req: Request, res: Response$1): Promise<void>;
    deleteEntityColumn(req: Request, res: Response$1): Promise<void>;
    deleteEntityRelation(req: Request, res: Response$1): Promise<void>;
    deleteEntity(req: Request, res: Response$1): Promise<void>;
    modSubRoute(req: Request, res: Response$1): Promise<void>;
    constructor();
    private afterProcedure;
}

declare abstract class BaseService {
    abstract init(): any;
}

declare type Configuration = {
    env?: string;
    port?: number;
    url?: string;
    authorized?: string | string[];
    api?: {
        name: string;
        version: string;
    };
    cachingEnabled?: boolean;
    authMode?: string;
    jwt?: {
        refreshExpires: number;
        accessExpires: number;
        secret: string;
    };
    elastic?: {
        enabled: boolean;
        url: string;
    };
    facebook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    outlook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    google?: {
        id: string;
        redirect: string;
        secret: string;
    };
    typeorm?: {
        database: string;
        host: string;
        name: string;
        synchronize: boolean;
        entities: string[];
        port: number;
        pwd: string;
        type: DatabaseType;
        user: string;
        tableName: string;
        migrationsDir: string;
        entitiesDir: string;
        migrations: string[];
        seeds: string;
        factories: string;
    };
    deploy?: {
        ip: string;
        user: string;
        path: string;
        key: string;
        repo: string;
        ref: string;
    };
    jimp?: {
        isActive: boolean;
        md: number;
        xl: number;
        xs: number;
    };
    mailgun?: {
        privateKey: string;
        publicKey: string;
        domain: string;
        host: string;
    };
    https?: {
        ca: string;
        cert: string;
        isActive: boolean;
        key: string;
    };
    oAuthKey: string;
};
declare class ConfigurationService<T = Configuration> extends BaseService {
    private _config;
    get config(): T;
    constructor();
    loadConfiguration(): T;
    getKey(key: keyof T): T[keyof T];
    init(): void;
}

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
declare class TypeORMService extends BaseService {
    private configurationService;
    private _connection;
    constructor(configurationService: ConfigurationService);
    init(): Promise<void>;
    disconnect(): Promise<void>;
    get connection(): Connection;
    get ConfigurationObject(): ConnectionOptions;
}

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
declare class MetadataController extends BaseController {
    private typeormConnection;
    constructor(typeormConnection: TypeORMService);
    getAllRoutes(): GlobalRouteDefinition[];
    getEntityRoutes(req: Request, res: Response$1): Promise<any>;
    getSupportedTypes(): typeorm.ColumnType[];
    countAllEntitiesRecords(): Promise<{
        entityName: string;
        count: number;
    }[]>;
    getRoles(req: Request, res: Response$1): Promise<String[]>;
    getPerms(req: Request, res: Response$1): Promise<any>;
    countEntityRecords(req: Request, res: Response$1): Promise<{
        count: number;
    }>;
    getEntityMeta(req: Request, res: Response$1): {
        id: string;
        entityName: string;
        table: string;
        columns: {
            property: string;
            type: string;
            default: string;
            width: number;
            length: string;
            isPrimary: boolean;
            isNullable: boolean;
            enumValues: (string | number)[];
        }[];
        relations: {
            propertyName: string;
            inverseEntityName: string;
            inversePropertyName: string;
            relationType: typeorm_metadata_types_RelationTypes.RelationType;
            isNullable: boolean;
        }[];
    };
    getEntities(req: Request, res: Response$1): {
        id: string;
        entityName: string;
        table: string;
        columns: {
            property: string;
            type: string;
            default: string;
            width: number;
            length: string;
            isPrimary: boolean;
            isNullable: boolean;
            enumValues: (string | number)[];
        }[];
        relations: {
            propertyName: string;
            inverseEntityName: string;
            inversePropertyName: string;
            relationType: typeorm_metadata_types_RelationTypes.RelationType;
            isNullable: boolean;
        }[];
    }[];
    protected getJsonApiEntities(): EntityMetadata[];
    protected findEntityMetadataByName(name: string): EntityMetadata;
    protected entityMetadaBuilder(table: EntityMetadata): {
        id: string;
        entityName: string;
        table: string;
        columns: {
            property: string;
            type: string;
            default: string;
            width: number;
            length: string;
            isPrimary: boolean;
            isNullable: boolean;
            enumValues: (string | number)[];
        }[];
        relations: {
            propertyName: string;
            inverseEntityName: string;
            inversePropertyName: string;
            relationType: typeorm_metadata_types_RelationTypes.RelationType;
            isNullable: boolean;
        }[];
    };
    protected getRoutes(routes: any, entity: string): any;
}

interface ModelInterface {
}

declare abstract class BaseModel implements ModelInterface {
    created_at: Date;
    updated_at: Date;
}

declare abstract class JsonApiModel<T> extends BaseModel {
    id: number;
    constructor(payload?: Partial<T>);
}

declare type PaginationQueryParams = {
    size: number;
    number: number;
};

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
declare class BaseJsonApiRepository<T> extends Repository<T> {
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

interface SerializerInterface<T> {
    serialize(payload: T | T[], meta?: any): any;
    deserialize(payload: any): T | T[];
    init(): any;
}

declare type Constructor<T> = new (...args: any[]) => T;
declare type AnyFunction = (...args: any[]) => any | Promise<any>;
declare type ObjectKey = string | number;

declare abstract class BaseSerializerSchema<T extends Record<string, any>> {
    get baseUrl(): string;
    /**
     *  Replace page number parameter value in given URL
     */
    protected replacePage: (url: string, newPage: number) => string;
    topLevelMeta(data: T, extraData: any, type: string): {};
    topLevelLinks(data: T, extraData: any, type: string): {
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
    links(data: T, extraData: any, type: string): {
        self: string;
    };
    relationshipLinks(data: T, extraData: any, type: string, relationshipName: string): {
        self: string;
        related: string;
    };
    meta(data: T, extraData: any, type: string): void;
    relationshipMeta(data: T, extraData: any, type: string, relationshipName: any): void;
}

declare type SerializerParams = {
    pagination?: PaginationParams;
};
declare type PaginationParams = {
    total: number;
    page: number;
    size: number;
    url: string;
};
declare abstract class BaseJsonApiSerializer<T> implements SerializerInterface<T> {
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

declare abstract class BaseJsonApiController<T extends JsonApiModel<T>> extends BaseController {
    entity: Constructor<T>;
    protected serializer: BaseJsonApiSerializer<T>;
    protected repository: BaseJsonApiRepository<T>;
    constructor();
    callMethod(methodName: string): any;
    list(req: Request, _res: Response$1): Promise<any>;
    get(req: Request, _res: Response$1): Promise<any>;
    create(req: Request, _res: Response$1): Promise<any>;
    update(req: Request, _res: Response$1): Promise<any>;
    remove(req: Request, res: Response$1): Promise<any>;
    fetchRelationships(req: Request, res: Response$1): Promise<Response$1<any, Record<string, any>>>;
    fetchRelated(req: Request, res: Response$1): Promise<any>;
    addRelationships(req: Request, res: Response$1): Promise<any>;
    updateRelationships(req: Request, res: Response$1): Promise<any>;
    removeRelationships(req: Request, res: Response$1): Promise<any>;
    protected parseJsonApiQueryParams(query: Record<string, any>): {
        includes: string[];
        sort: string[];
        fields: any;
        page: any;
        filter: any;
    };
}

declare abstract class BaseErrorMiddleware implements ErrorMiddlewareInterface {
    protected context: RouteContext;
    init(context: RouteContext): void;
    abstract use(err: any, req: Request, res: Response$1, next: (err?: any) => void, args: any): any;
}

/**
 *
 * @param routeName
 */
declare function RegisterApplication({ controllers, services, }: {
    controllers: Constructor<any>[];
    services: Constructor<BaseService>[];
}): ClassDecorator;
declare function GlobalMiddleware(middleware: Constructor<BaseMiddleware | BaseErrorMiddleware>, args?: any, order?: "before" | "after"): ClassDecorator;

interface EntityOptionsExtended<T> extends EntityOptions {
    repository: Constructor<BaseJsonApiRepository<T>>;
    serializer: Constructor<BaseJsonApiSerializer<T>>;
    validator: any;
}
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
declare function JsonApiEntity<T>(options?: EntityOptionsExtended<T>): ClassDecorator;
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
declare function JsonApiEntity<T>(name?: string, options?: EntityOptionsExtended<T>): ClassDecorator;

interface RelationMetadata {
    type: () => Schema;
    property: string;
}
/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
declare function Serialize(): PropertyDecorator;
declare function Deserialize(): PropertyDecorator;
declare function Relation(type: () => Schema): PropertyDecorator;
declare type Schema = Constructor<any>;
interface SchemaOptions {
    schemas: () => Constructor<BaseSerializerSchema<any>>[];
    type: string;
}
/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
declare function JsonApiSerializer(options: SchemaOptions): ClassDecorator;
declare function SerializerSchema(name?: string): ClassDecorator;

interface RouteContext {
    routeDefinition: RouteDefinition;
    controllerInstance: BaseController;
}
interface GlobalRouteDefinition {
    prefix: string;
    type: routeType;
    routes: RouteDefinition[];
}
interface RouteDefinition {
    path: string;
    requestMethod: RequestMethods;
    methodName: string;
}
declare type routeType = "basic" | "generated" | "entity";

declare abstract class BaseMiddleware implements MiddlewareInterface {
    protected context: RouteContext;
    init(context: RouteContext): void;
    abstract use(req: Request, res: Response$1, next: (err?: any) => void, args: any): any;
}

declare type ValidationSchema<T> = {
    [P in keyof T]?: ParamSchema;
};

declare type RequestMethods = "get" | "post" | "delete" | "options" | "put" | "patch";
interface MiddlewareMetadata {
    middleware: Constructor<BaseMiddleware>;
    args?: any;
}
interface JsonApiMiddlewareMetadata extends MiddlewareMetadata {
    order: MiddlewareOrder;
}
declare type MiddlewareOrder = "afterValidation" | "beforeValidation" | "afterDeserialization" | "beforeDeserialization" | "beforeAll" | "afterAll";
/**
 *
 * @param routeName
 */
declare function Controller(routeName: string): ClassDecorator;
/**
 *
 * @param routeName
 */
declare function GeneratedController(routeName: string): ClassDecorator;
/**
 *
 * @param entity
 */
declare function JsonApiController<T extends JsonApiModel<T>>(entity: Constructor<T>): ClassDecorator;
declare function RouteMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T): ClassDecorator;
declare function MethodMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T): MethodDecorator;
declare function JsonApiMethodMiddleware<T = any>(middlewareClass: Constructor<BaseMiddleware>, args?: T, order?: MiddlewareOrder): MethodDecorator;
declare function OverrideSerializer(schema?: string): MethodDecorator;
declare function OverrideValidator<T>(schema: ValidationSchema<T>): MethodDecorator;
declare function Get(path?: string): MethodDecorator;
declare function Post(path?: string): MethodDecorator;
declare function Patch(path?: string): MethodDecorator;
declare function Put(path?: string): MethodDecorator;
declare function Delete(path?: string): MethodDecorator;

interface ApplicationInterface {
    init(): Promise<any>;
    setupMiddlewares(middlewares: MiddlewareMetadata[]): Promise<any>;
    setupControllers(controllers: Constructor<BaseController>[]): Promise<any>;
    afterInit(): Promise<any>;
    listen(port: number): any;
}

declare abstract class BaseApplication implements ApplicationInterface {
    protected app: Express.Application;
    protected router: Express.Router;
    protected routes: GlobalRouteDefinition[];
    constructor();
    setupMiddlewares(middlewaresForApp: MiddlewareMetadata[]): Promise<any>;
    abstract afterInit(): Promise<any>;
    init(): Promise<any>;
    get App(): Express.Application;
    get Routes(): GlobalRouteDefinition[];
    listen(port: number): Promise<unknown>;
    /**
     * Setup controllers routing
     */
    setupControllers(controllers: Constructor<BaseController>[]): Promise<void>;
    private useMiddleware;
}

declare enum ApplicationStatus {
    Booting = "BOOTING",
    Running = "RUNNING",
    None = "NONE"
}
declare enum ApplicationLifeCycleEvent {
    Boot = "BOOT",
    Running = "RUNNING"
}
declare class ApplicationRegistry {
    static application: BaseApplication;
    static entities: Constructor<JsonApiModel<any>>[];
    static repositories: {
        [key: string]: Constructor<BaseJsonApiRepository<any>>;
    };
    static serializers: {
        [key: string]: Constructor<BaseJsonApiSerializer<any>>;
    };
    static controllers: BaseController[];
    static status: ApplicationStatus;
    static guid: any;
    private static eventEmitter;
    static on(event: ApplicationLifeCycleEvent, callback: any): void;
    static registerApplication<T extends BaseApplication>(app: Constructor<T>): Promise<T>;
    static registerEntity<T extends JsonApiModel<T>>(entity: Constructor<T>): void;
    static repositoryFor<T extends JsonApiModel<T>>(entity: Constructor<T>): BaseJsonApiRepository<T>;
    static serializerFor<T extends JsonApiModel<T>>(entity: Constructor<T>): BaseJsonApiSerializer<T>;
    static registerController(controller: BaseController): void;
    static registerCustomRepositoryFor<T extends JsonApiModel<T>>(entity: Constructor<T>, repository: Constructor<BaseJsonApiRepository<T>>): void;
    static registerSerializerFor<T extends JsonApiModel<T>>(entity: Constructor<T>, serializer: Constructor<BaseJsonApiSerializer<T>>): void;
}

declare const arrayOfInt: string[];
declare const arrayOfString: string[];
declare const arrayOfNumber: string[];
declare const arrayOfDate: string[];

declare const jsonApiRoutes: {
    path: string;
    methodType: string;
    method: string;
    middlewares: string[];
}[];

/**
 * All Http request methods.
 */
declare const allHttpRequestMethods: string[];
/**
 * Http request methods compatibles with NFW.
 */
declare const httpRequestMethods: string[];

declare class RelationshipNotFoundError extends Error {
    constructor(message: string);
}

interface TemplateStructureInterface {
    template: string;
    path: string;
    name: string;
}
declare function getEntityNaming(entity: string): {
    classPrefixName: any;
    filePrefixName: string;
    entity: string;
};
declare function resources(entity: string): TemplateStructureInterface[];

interface GeneratorParameters {
    modelName: string;
    filePrefixName: string;
    fileTemplateInfo: TemplateStructureInterface;
    tableColumns: EntityColumns;
    classPrefixName: string;
}
interface EntityColumn {
    name: string;
    type: string;
    length?: number;
    width?: number;
    precision?: number;
    scale?: number;
    isNullable: boolean;
    isPrimary?: boolean;
    isUnique?: boolean;
    default: any;
    now?: boolean;
    enums: Array<string>;
}
declare type RelationTypes = "one-to-one" | "one-to-many" | "many-to-many";
interface EntityRelation {
    name: string;
    target: string;
    type: RelationTypes;
    inverseRelationName?: string;
    isNullable?: boolean;
}
interface EntityColumns {
    columns: EntityColumn[];
    relations: EntityRelation[];
}

declare function addColumn(entity: string, column: EntityColumn): Promise<void>;

/**
 * Add an endpoint to a specific route.
 * @param prefix Prefix of the route.
 * @param method Method of the endpoint.
 * @param subroute Any subroute that would come after the endpoint.
 */
declare function addEndpoint(prefix: string, method: string, subroute?: string): Promise<void>;

declare function addPerms(element: any): Promise<void>;

declare function addRelation(entity: string, relation: EntityRelation): Promise<void>;

declare function addRole(roleName: string): Promise<void>;

declare function deleteJsonApiEntity(modelName: string): Promise<void>;

declare function deleteRole(roleName: string): Promise<void>;

declare function deleteBasicRoute(prefix: string): Promise<void>;

declare function generateJsonApiEntity(modelName: string, data?: EntityColumns): Promise<void>;

/**
 * Generates a basic route.
 * @param prefix Prefix of the route.
 * @param methods Methods used in the route.
 * @returns A promise.
 */
declare function generateBasicRoute(prefix: string, methods?: Array<string>): Promise<void>;

declare function getEntityRoutes(entity: string, routes?: any): Promise<any>;

declare function getPerms(entity: any): Promise<any>;

declare function getRoles(): Promise<Array<String>>;

declare function getRoutes(): Promise<GlobalRouteDefinition[]>;

declare function getSupportedTypes(): Promise<Array<String>>;

declare function removeColumn(modelName: string, column: EntityColumn | string): Promise<void>;

/**
 * Delete an endpoint of a specific route.
 * @param prefix Prefix of the route.
 * @param methodName Ts Method.
 */
declare function deleteEndpoint(prefix: string, methodName: string): Promise<void>;
declare function deleteEndpointByUri(prefix: string, subroute: string, requestMethod: string): Promise<void>;

declare function removePerms(element: any): Promise<void>;

declare function removeRelation(entity: string, relationName: string | EntityRelation): Promise<void>;

declare function save(): Promise<void>;

/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
declare function createBaseControllerTemplate({ fileTemplateInfo, classPrefixName, filePrefixName }: GeneratorParameters): ts_morph.SourceFile;

/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
declare function createControllerTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function createEnumsTemplate(name: string, enums: Array<string>): void;

/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
declare function createModelTemplate({ fileTemplateInfo, classPrefixName, modelName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function createRepositoryTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function createSerializerSchema({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function createSerializer({ modelName, fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function createTestTemplate({ fileTemplateInfo }: GeneratorParameters): ts_morph.SourceFile;

declare function createValidationTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): ts_morph.SourceFile;

declare function getJsonApiEntityName(prefix: string): {
    entityName: string;
    tableName: string;
};

declare function buildModelColumnArgumentsFromObject(dbColumnaData: EntityColumn): ColumnOptions;
declare function buildValidationArgumentsFromObject(dbColumnaData: EntityColumn): ValidationSchema<any>;

declare type DeserializeMiddlewareArgs = {
    serializer: Constructor<BaseJsonApiSerializer<any>>;
    schema?: string;
};
declare class DeserializeMiddleware extends BaseMiddleware {
    use(req: Request, response: Response$1, next: NextFunction, args: DeserializeMiddlewareArgs): Promise<any>;
}

declare type ValidationMiddlewareArgs = {
    schema: Record<string, ParamSchema>;
    location?: Location[];
};
declare class ValidationMiddleware extends BaseMiddleware {
    use(req: Request, response: Response$1, next: NextFunction, args: ValidationMiddlewareArgs): Promise<any>;
}

declare class Response {
    type: string;
    status: number;
    body: any;
    constructor(body: any, { status, type }?: {
        status: number;
        type: string;
    });
}

declare class PaginationResponse extends Response {
    paginationData: PaginationParams;
    constructor(body: any, paginationData: PaginationParams, { status, type }?: {
        status: number;
        type: string;
    });
}

declare const toKebabCase: (str: string) => string;
declare const toSnakeCase: (str: string) => string;
declare const toCamelCase: (str: string) => string;

declare const fullLog: (element: any) => void;
declare const shadowLog: (element: any) => void;

declare function mesure(expression: AnyFunction): Promise<number>;

declare const booleanMap: {
    0: boolean;
    1: boolean;
    false: boolean;
    no: boolean;
    true: boolean;
    yes: boolean;
};
declare function parseBool(string: string): boolean;

declare const jsonApiQuery: Schema$1;
declare const get: ValidationSchema<any>;
declare const list: ValidationSchema<any>;
declare const create: ValidationSchema<any>;
declare const remove: ValidationSchema<any>;
declare const fetchRelated: ValidationSchema<any>;
declare const fetchRelationships: ValidationSchema<any>;
declare const addRelationships: ValidationSchema<any>;
declare const updateRelationships: ValidationSchema<any>;
declare const removeRelationships: ValidationSchema<any>;
declare const update: ValidationSchema<any>;

declare const createEntity: ValidationSchema<any>;
declare const createRelation: ValidationSchema<EntityRelation>;
declare const createColumn: ValidationSchema<EntityColumn>;
declare const columnsActions: ValidationSchema<any>;
declare const createRoute: ValidationSchema<any>;
declare const createSubRoute: ValidationSchema<any>;
declare const addPermissions: ValidationSchema<any>;

export { AnyFunction, ApplicationInterface, ApplicationLifeCycleEvent, ApplicationRegistry, ApplicationStatus, BaseApplication, BaseController, BaseErrorMiddleware, BaseJsonApiController, BaseJsonApiRepository, BaseJsonApiSerializer, BaseMiddleware, BaseModel, BaseSerializerSchema, BaseService, Configuration, ConfigurationService, Constructor, Controller, ControllerInterface, Delete, Deserialize, DeserializeMiddleware, DeserializeMiddlewareArgs, EntityColumn, EntityColumns, EntityOptionsExtended, EntityRelation, ErrorMiddlewareInterface, GeneratedController, GeneratorController, GeneratorParameters, Get, GlobalMiddleware, JsonApiController, JsonApiEntity, JsonApiMethodMiddleware, JsonApiMiddlewareMetadata, JsonApiModel, JsonApiSerializer, MetadataController, MethodMiddleware, MiddlewareInterface, MiddlewareMetadata, MiddlewareOrder, ModelInterface, ObjectKey, OverrideSerializer, OverrideValidator, PaginationParams, PaginationQueryParams, PaginationResponse, Patch, Post, Put, RegisterApplication, Relation, RelationMetadata, RelationTypes, RelationshipNotFoundError, RequestMethods, Response, RouteMiddleware, Schema, SchemaOptions, Serialize, SerializerInterface, SerializerParams, SerializerSchema, TemplateStructureInterface, TypeORMService, ValidationMiddleware, ValidationMiddlewareArgs, ValidationSchema, WsController, addColumn, addEndpoint, addPermissions, addPerms, addRelation, addRelationships, addRole, allHttpRequestMethods, arrayOfDate, arrayOfInt, arrayOfNumber, arrayOfString, booleanMap, buildModelColumnArgumentsFromObject, buildValidationArgumentsFromObject, columnsActions, create, createBaseControllerTemplate, createColumn, createControllerTemplate, createEntity, createEnumsTemplate, createModelTemplate, createRelation, createRepositoryTemplate, createRoute, createSerializer, createSerializerSchema, createSubRoute, createTestTemplate, createValidationTemplate, deleteBasicRoute, deleteEndpoint, deleteEndpointByUri, deleteJsonApiEntity, deleteRole, fetchRelated, fetchRelationships, fullLog, generateBasicRoute, generateJsonApiEntity, get, getEntityNaming, getEntityRoutes, getJsonApiEntityName, getPerms, getRoles, getRoutes, getSupportedTypes, httpRequestMethods, jsonApiQuery, jsonApiRoutes, list, mesure, parseBool, remove, removeColumn, removePerms, removeRelation, removeRelationships, resources, save, shadowLog, toCamelCase, toKebabCase, toSnakeCase, update, updateRelationships };
