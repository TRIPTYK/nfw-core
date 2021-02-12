import { EntityOptions } from "typeorm";
import { BaseJsonApiRepository } from "../repositories/base.repository";
import { BaseJsonApiSerializer } from "../serializers/base.serializer";
import { Constructor } from "../types/global";
export interface EntityOptionsExtended<T> extends EntityOptions {
    repository: Constructor<BaseJsonApiRepository<T>>;
    serializer: Constructor<BaseJsonApiSerializer<T>>;
    validator: any;
}
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export declare function JsonApiEntity<T>(options?: EntityOptionsExtended<T>): ClassDecorator;
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export declare function JsonApiEntity<T>(name?: string, options?: EntityOptionsExtended<T>): ClassDecorator;
