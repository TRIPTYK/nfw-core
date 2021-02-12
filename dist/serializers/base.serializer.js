"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJsonApiSerializer = void 0;
const JSONAPISerializer = require("json-api-serializer");
const case_util_1 = require("../utils/case.util");
class BaseJsonApiSerializer {
    constructor() {
        this.serializer = new JSONAPISerializer({
            convertCase: "camelCase",
            unconvertCase: "snake_case",
        });
        const schemasData = Reflect.getMetadata("schemas", this);
        for (const schema of schemasData.schemas()) {
            Reflect.defineMetadata("type", schemasData.type, schema);
        }
    }
    init() {
        const schemasData = Reflect.getMetadata("schemas", this);
        this.type = schemasData.type;
        for (const schema of schemasData.schemas()) {
            const passedBy = [];
            this.convertSerializerSchemaToObjectSchema(schema, schema, Reflect.getMetadata("name", schema), passedBy);
        }
        // TODO : move in it's own prefab schema ? move outside ?
        this.serializer.register(this.type, "relationships", {
            topLevelLinks: (data, extraData) => {
                return {
                    self: `/${extraData.thisType}/${extraData.id}/relationships/${extraData.relationName}`,
                    related: `/${extraData.thisType}/${extraData.id}/${extraData.relationName}`,
                };
            },
        });
    }
    serialize(payload, schema, extraData) {
        return this.serializer.serializeAsync(this.type, payload, schema, extraData);
    }
    pagination(payload, schema, extraData) {
        return this.serializer.serializeAsync(this.type, payload, schema, extraData);
    }
    deserialize(payload) {
        return this.serializer.deserializeAsync(this.type, payload);
    }
    applyDeserializeCase(deserializeArray) {
        const convertCase = this.serializer.opts.convertCase ?? "camelCase";
        switch (convertCase) {
            case "camelCase":
                return deserializeArray.map((e) => case_util_1.toCamelCase(e));
            case "snake_case":
                return deserializeArray.map((e) => case_util_1.toSnakeCase(e));
            case "kebab-case":
                return deserializeArray.map((e) => case_util_1.toKebabCase(e));
            default: {
                return deserializeArray;
            }
        }
    }
    getSchema(name) {
        const schemasData = Reflect.getMetadata("schemas", this);
        return schemasData
            .schemas()
            .find((schema) => Reflect.getMetadata("name", schema) === name);
    }
    convertSerializerSchemaToObjectSchema(schema, rootSchema, schemaName, passedBy) {
        const serialize = (Reflect.getMetadata("serialize", schema.prototype) ??
            []);
        const deserialize = this.applyDeserializeCase((Reflect.getMetadata("deserialize", schema.prototype) ?? []));
        const relations = (Reflect.getMetadata("relations", schema.prototype) ??
            []);
        const schemaType = Reflect.getMetadata("type", schema);
        const schemaInstance = new schema();
        const relationShips = {};
        if (passedBy.includes(schema.name)) {
            return;
        }
        passedBy.push(schema.name);
        for (const { type, property } of relations) {
            const schemaTypeRelation = type();
            const relationType = Reflect.getMetadata("type", schemaTypeRelation);
            relationShips[property] = {
                deserialize: (data) => {
                    return { id: data.id };
                },
                type: relationType,
                links: (data, extraData) => {
                    return schemaInstance.relationshipLinks(data, extraData, this.type, property);
                },
            };
            this.convertSerializerSchemaToObjectSchema(schemaTypeRelation, rootSchema, schemaName, passedBy);
        }
        this.serializer.register(schemaType, schemaName, {
            whitelist: serialize,
            whitelistOnDeserialize: deserialize,
            relationships: relationShips,
            topLevelLinks: (data, extraData) => {
                return schemaInstance.topLevelLinks(data, extraData, this.type);
            },
            links: (data, extraData) => {
                return schemaInstance.links(data, extraData, this.type);
            },
            meta: (data, extraData) => {
                return schemaInstance.meta(data, extraData, this.type);
            },
        });
    }
}
exports.BaseJsonApiSerializer = BaseJsonApiSerializer;
BaseJsonApiSerializer.whitelist = [];
