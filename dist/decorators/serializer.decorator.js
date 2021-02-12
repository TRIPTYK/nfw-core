"use strict";
/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerializerSchema = exports.JsonApiSerializer = exports.Relation = exports.Deserialize = exports.Serialize = void 0;
const tsyringe_1 = require("tsyringe");
/**
 * Comment
 *
 * @returns {PropertyDecorator}
 */
function Serialize() {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata("serialize", target)) {
            Reflect.defineMetadata("serialize", [], target);
        }
        Reflect.getMetadata("serialize", target).push(propertyKey);
    };
}
exports.Serialize = Serialize;
function Deserialize() {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata("deserialize", target)) {
            Reflect.defineMetadata("deserialize", [], target);
        }
        Reflect.getMetadata("deserialize", target).push(propertyKey);
    };
}
exports.Deserialize = Deserialize;
function Relation(type) {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata("relations", target)) {
            Reflect.defineMetadata("relations", [], target);
        }
        const relations = Reflect.getMetadata("relations", target);
        relations.push({
            type,
            property: propertyKey
        });
    };
}
exports.Relation = Relation;
/**
 * Comment
 *
 * @returns {ClassDecorator}
 */
function JsonApiSerializer(options) {
    return function (target) {
        tsyringe_1.container.registerSingleton(target);
        Reflect.defineMetadata("schemas", options, target.prototype);
    };
}
exports.JsonApiSerializer = JsonApiSerializer;
function SerializerSchema(name = "default") {
    return function (target) {
        Reflect.defineMetadata("name", name, target);
    };
}
exports.SerializerSchema = SerializerSchema;
//# sourceMappingURL=serializer.decorator.js.map