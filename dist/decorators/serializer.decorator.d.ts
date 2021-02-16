import { BaseSerializerSchema } from "../serializers/base.serializer-schema";
import { Constructor } from "../types/global";
export interface RelationMetadata {
    type: () => Schema;
    property: string;
}
/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
export declare function Serialize(): PropertyDecorator;
export declare function Deserialize(): PropertyDecorator;
export declare function Relation(type: () => Schema): PropertyDecorator;
export declare type Schema = Constructor<any>;
export interface SchemaOptions {
    schemas: () => Constructor<BaseSerializerSchema<any>>[];
    type: string;
}
/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
export declare function JsonApiSerializer(options: SchemaOptions): ClassDecorator;
export declare function SerializerSchema(name?: string): ClassDecorator;
