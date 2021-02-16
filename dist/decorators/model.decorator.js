"use strict";
/* eslint-disable @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonApiEntity = void 0;
const typeorm_1 = require("typeorm");
const registry_application_1 = require("../application/registry.application");
const base_repository_1 = require("../repositories/base.repository");
/**
 * This decorator is used to mark classes that will be an entity (table or document depend on database type).
 * Database schema will be created for all classes decorated with it, and Repository can be retrieved and used for it.
 */
function JsonApiEntity(nameOrOptions, maybeOptions) {
    const options = (typeof nameOrOptions === "object" ? nameOrOptions : maybeOptions) || {};
    const name = typeof nameOrOptions === "string" ? nameOrOptions : options.name;
    return function (target) {
        typeorm_1.getMetadataArgsStorage().tables.push({
            target,
            name,
            type: "regular",
            orderBy: options.orderBy ? options.orderBy : undefined,
            engine: options.engine ? options.engine : undefined,
            database: options.database ? options.database : undefined,
            schema: options.schema ? options.schema : undefined,
            synchronize: options.synchronize,
            withoutRowid: options.withoutRowid,
        });
        Reflect.defineMetadata("name", name, target);
        Reflect.defineMetadata("repository", options.repository, target);
        Reflect.defineMetadata("serializer", options.serializer, target);
        Reflect.defineMetadata("validator", options.validator, target);
        typeorm_1.getMetadataArgsStorage().entityRepositories.push({
            target: options.repository,
            entity: target,
        });
        registry_application_1.ApplicationRegistry.registerEntity(target);
        registry_application_1.ApplicationRegistry.registerCustomRepositoryFor(target, options.repository ?? new base_repository_1.BaseJsonApiRepository());
        registry_application_1.ApplicationRegistry.registerSerializerFor(target, options.serializer);
    };
}
exports.JsonApiEntity = JsonApiEntity;
