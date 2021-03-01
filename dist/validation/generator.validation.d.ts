import { EntityColumn, EntityRelation } from "../generator/interfaces/generator.interface";
import { ValidationSchema } from "../types/validation";
export declare const createEntity: ValidationSchema<any>;
export declare const createRelation: ValidationSchema<EntityRelation>;
export declare const createColumn: ValidationSchema<EntityColumn>;
export declare const columnsActions: ValidationSchema<any>;
export declare const createRoute: ValidationSchema<any>;
export declare const createSubRoute: ValidationSchema<any>;
