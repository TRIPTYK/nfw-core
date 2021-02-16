import { ColumnOptions } from "typeorm";
import { ValidationSchema } from "../../types/validation";
import { EntityColumn } from "../interfaces/generator.interface";
export declare function buildModelColumnArgumentsFromObject(dbColumnaData: EntityColumn): ColumnOptions;
export declare function buildValidationArgumentsFromObject(dbColumnaData: EntityColumn): ValidationSchema<any>;
