import { Request, Response } from "express";
import { EntityMetadata } from "typeorm";
import { TypeORMService } from "../../services/typeorm.service";
import { BaseController } from "../base.controller";
/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
export declare class MetadataController extends BaseController {
    private typeormConnection;
    constructor(typeormConnection: TypeORMService);
    getAllRoutes(): {
        prefix: string;
        type: "basic" | "generated" | "entity";
        routes: import("../../decorators/controller.decorator").RouteDefinition[];
    }[];
    getEntityRoutes(req: Request, res: Response): Promise<any>;
    getSupportedTypes(): import("typeorm").ColumnType[];
    countAllEntitiesRecords(): Promise<{
        entityName: string;
        count: number;
    }[]>;
    getRoles(req: Request, res: Response): Promise<String[]>;
    getPerms(req: Request, res: Response): Promise<any>;
    countEntityRecords(req: Request, res: Response): Promise<{
        count: number;
    }>;
    getEntityMeta(req: Request, res: Response): {
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
            relationType: import("typeorm/metadata/types/RelationTypes").RelationType;
            isNullable: boolean;
        }[];
    };
    getEntities(req: Request, res: Response): {
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
            relationType: import("typeorm/metadata/types/RelationTypes").RelationType;
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
            relationType: import("typeorm/metadata/types/RelationTypes").RelationType;
            isNullable: boolean;
        }[];
    };
    protected getRoutes(routes: any, entity: string): any;
}
