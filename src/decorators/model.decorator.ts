/* eslint-disable @typescript-eslint/ban-types */

import { EntityOptions, getMetadataArgsStorage } from "typeorm";
import { TableMetadataArgs } from "typeorm/metadata-args/TableMetadataArgs";
import { getMetadataStorage } from "../metadata/metadata-storage";

export interface EntityOptionsExtended<T> extends EntityOptions {}

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
  options?: EntityOptionsExtended<T>
): ClassDecorator;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
  name?: string,
  options?: EntityOptionsExtended<T>
): ClassDecorator;

/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
export function JsonApiEntity<T>(
  nameOrOptions?: string | any,
  maybeOptions?: EntityOptionsExtended<T>
) {
  const options =
    (typeof nameOrOptions === "object" ? nameOrOptions : maybeOptions) || {};
  const name = typeof nameOrOptions === "string" ? nameOrOptions : options.name;

  return function (target) {
    getMetadataArgsStorage().tables.push({
      target,
      name,
      type: "regular",
      orderBy: options.orderBy ? options.orderBy : undefined,
      engine: options.engine ? options.engine : undefined,
      database: options.database ? options.database : undefined,
      schema: options.schema ? options.schema : undefined,
      synchronize: options.synchronize,
      withoutRowid: options.withoutRowid,
    } as TableMetadataArgs);

    
    getMetadataStorage().entities.push({
      name,
      target
    });
  };
}
