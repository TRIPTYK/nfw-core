/* eslint-disable @typescript-eslint/ban-types */

import { container } from "tsyringe";
import { getMetadataStorage } from "../metadata/metadata-storage";
import { BaseSerializerSchema } from "../serializers/base.serializer-schema";
import { Constructor } from "../types/global";

export function Serialize(): PropertyDecorator {
  return function (target: Constructor<BaseSerializerSchema<unknown>>, propertyKey: string) {
    getMetadataStorage().serializerSchemaColumns.push({
      target,
      type:"serialize",
      column: propertyKey
    });
  };
}

export function Deserialize(): PropertyDecorator {
  return function (target: Constructor<BaseSerializerSchema<unknown>>, propertyKey: string) {
    getMetadataStorage().serializerSchemaColumns.push({
      target,
      type: "deserialize",
      column: propertyKey
    });
  };
}

export function Relation(type: () => Constructor<BaseSerializerSchema<unknown>>): PropertyDecorator {
  return function (target: Constructor<BaseSerializerSchema<unknown>>, propertyKey: string) {
    getMetadataStorage().serializerSchemaRelations.push({
      target,
      relation : type,
      column: propertyKey
    });
  };
}

export interface SchemaOptions {
  schemas: () => Constructor<BaseSerializerSchema<any>>[];
  type: string;
}

/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export function JsonApiSerializer(options: SchemaOptions): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    container.registerSingleton(target as any);
    Reflect.defineMetadata("schemas", options, target.prototype);
  };
}

export function SerializerSchema(name = "default"): ClassDecorator {
  return function <TFunction extends Function>(target: TFunction) {
    Reflect.defineMetadata("name", name, target);
  };
}
