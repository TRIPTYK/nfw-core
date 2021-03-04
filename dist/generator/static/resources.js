"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resources = exports.getEntityNaming = void 0;
const kebab_case_1 = require("@queso/kebab-case");
const pascalcase = require("pascalcase");
function getEntityNaming(entity) {
    return {
        classPrefixName: pascalcase(entity),
        filePrefixName: kebab_case_1.default(entity),
        entity: entity.toLowerCase(),
    };
}
exports.getEntityNaming = getEntityNaming;
function resources(entity) {
    const { filePrefixName } = getEntityNaming(entity);
    return [
        {
            template: "base-controller",
            path: "src/api/controllers",
            name: `${filePrefixName}.controller.ts`,
        },
        {
            template: "controller",
            path: "src/api/controllers",
            name: `${filePrefixName}.controller.ts`,
        },
        {
            template: "repository",
            path: "src/api/repositories",
            name: `${filePrefixName}.repository.ts`,
        },
        {
            template: "validation",
            path: "src/api/validations",
            name: `${filePrefixName}.validation.ts`,
        },
        {
            template: "serializer-schema",
            path: "src/api/serializers/schemas",
            name: `${filePrefixName}.serializer.schema.ts`,
        },
        { template: "test", path: "test", name: `${filePrefixName}.test.ts` },
        {
            template: "serializer",
            path: "src/api/serializers",
            name: `${filePrefixName}.serializer.ts`,
        },
        {
            template: "model",
            path: "src/api/models",
            name: `${filePrefixName}.model.ts`,
        },
        {
            template: "roles",
            path: "src/api/enums",
            name: `${filePrefixName}.enum.ts`,
        },
    ];
}
exports.resources = resources;
