"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPermissions = exports.createSubRoute = exports.createRoute = exports.columnsActions = exports.createColumn = exports.createRelation = exports.createEntity = void 0;
const tsyringe_1 = require("tsyringe");
const typeorm_service_1 = require("../services/typeorm.service");
exports.createEntity = {
    columns: {
        exists: true,
        isArray: true,
    },
    "columns.*.name": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    "columns.*.type": {
        exists: true,
        isString: true,
        custom: {
            options: (value) => {
                const suported = tsyringe_1.container.resolve(typeorm_service_1.TypeORMService).connection.driver
                    .supportedDataTypes;
                if (!Object.values(suported).includes(value)) {
                    throw new Error("unsupported value");
                }
                return true;
            },
        },
    },
    "columns.*.default": {
        optional: true,
    },
    "columns.*.length": {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    "columns.*.width": {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    "columns.*.precision": {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    "columns.*.scale": {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    "columns.*.isUnique": {
        optional: true,
        isBoolean: true,
        toBoolean: true,
    },
    "columns.*.isNullable": {
        exists: true,
        isBoolean: true,
        toBoolean: true,
    },
    relations: {
        exists: true,
        isArray: true,
    },
    "relations.*.name": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    "relations.*.target": {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    "relations.*.type": {
        exists: true,
        isIn: {
            options: [["many-to-many", "one-to-many", "one-to-one"]],
        },
    },
    "relations.*.inverseRelationName": {
        optional: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
};
exports.createRelation = {
    name: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    target: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    type: {
        exists: true,
        isIn: {
            options: [["many-to-many", "one-to-many", "one-to-one"]],
        },
    },
    inverseRelationName: {
        optional: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    isNullable: {
        optional: true,
        isBoolean: true,
        toBoolean: true,
    },
};
exports.createColumn = {
    name: {
        exists: true,
        isString: true,
        matches: {
            options: /^[a-zA-Z_$][0-9a-zA-Z_$]*$/,
        },
    },
    type: {
        exists: true,
        isString: true,
        custom: {
            options: (value) => {
                const suported = tsyringe_1.container.resolve(typeorm_service_1.TypeORMService).connection.driver
                    .supportedDataTypes;
                if (!Object.values(suported).includes(value)) {
                    throw new Error("unsupported value");
                }
                return true;
            },
        },
    },
    default: {
        optional: true,
    },
    length: {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    width: {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    precision: {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    scale: {
        optional: {
            options: {
                checkFalsy: true,
            },
        },
        isInt: true,
        toInt: true,
    },
    isUnique: {
        exists: true,
        isBoolean: true,
        toBoolean: true,
    },
    isNullable: {
        exists: true,
        isBoolean: true,
        toBoolean: true,
    },
};
exports.columnsActions = {
    ...exports.createEntity,
    "columns.*.action": {
        exists: true,
        isIn: {
            options: [["ADD", "REMOVE"]],
        },
    },
    "relations.*.action": {
        exists: true,
        isIn: {
            options: [["ADD", "REMOVE"]],
        },
    },
};
const methods = [
    "GET",
    "PUT",
    "POST",
    "DELETE",
    "PATCH",
    "COPY",
    "HEAD",
    "OPTIONS",
    "LINK",
    "UNLINK",
    "PURGE",
    "LOCK",
    "UNLOCK",
    "PROFIND",
    "VIEW",
];
exports.createRoute = {
    methods: {
        exists: true,
        isArray: true,
    },
    "methods.*": {
        isIn: {
            options: [methods],
        },
    },
};
exports.createSubRoute = {
    method: {
        exists: true,
        isString: true,
        isIn: {
            options: [methods],
        },
    },
    subRoute: {
        exists: true,
        isString: true,
    },
};
exports.addPermissions = {
    elements: {
        exists: true,
        isArray: true,
    },
    "elements.*.role": {
        exists: true,
        isString: true,
    },
    "elements.*.type": {
        exists: true,
        isString: true,
    },
    "elements.*.entity": {
        isString: true,
        optional: true,
    },
    "elements.*.methodName": {
        isString: true,
        optional: true,
    },
    "elements.*.requestMethod": {
        isString: true,
        optional: true,
    },
    "elements.*.path": {
        isString: true,
        optional: true,
    },
};
