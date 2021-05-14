"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.removeRelationships = exports.updateRelationships = exports.addRelationships = exports.fetchRelationships = exports.fetchRelated = exports.remove = exports.create = exports.list = exports.get = exports.jsonApiQuery = void 0;
const isObject = (element) => typeof element === "object";
const isObjectOrString = (element) => typeof element === "object" || typeof element === "string";
exports.jsonApiQuery = {
    "page.*": {
        in: ["query"],
        isInt: true,
        toInt: true,
    },
    fields: {
        in: ["query"],
        optional: true,
        errorMessage: "Must be a string or object",
        custom: {
            options: isObjectOrString,
        },
    },
    include: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional: true,
        isString: true,
    },
    sort: {
        in: ["query"],
        errorMessage: "Must be a string",
        optional: true,
        isString: true,
    },
    filter: {
        in: ["query"],
        errorMessage: "Must be an object",
        optional: true,
        custom: {
            options: isObject,
        },
    },
};
exports.get = {
    ...exports.jsonApiQuery,
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
};
exports.list = {
    ...exports.jsonApiQuery,
};
exports.create = {};
exports.remove = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
};
exports.fetchRelated = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
    relation: {
        in: ["params"],
        isString: true,
    },
};
exports.fetchRelationships = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
    relation: {
        in: ["params"],
        isString: true,
    },
};
exports.addRelationships = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
    relation: {
        in: ["params"],
        isString: true,
    },
};
exports.updateRelationships = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
    relation: {
        in: ["params"],
        isString: true,
    },
};
exports.removeRelationships = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
    relation: {
        in: ["params"],
        isString: true,
    },
};
exports.update = {
    id: {
        errorMessage: "Please provide a valid id",
        in: ["params"],
        isInt: true,
        toInt: true,
    },
};
