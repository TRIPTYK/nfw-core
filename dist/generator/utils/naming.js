"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJsonApiEntityName = void 0;
const typeorm_1 = require("typeorm");
const application_1 = require("../../application");
function getJsonApiEntityName(prefix) {
    return typeorm_1.getConnection()
        .entityMetadatas.filter((table) => application_1.ApplicationRegistry.entities.includes(table.target))
        .map((table) => {
        return {
            entityName: table.name,
            tableName: table.tableName
        };
    })
        .find((table) => table.tableName.toLowerCase() === prefix);
}
exports.getJsonApiEntityName = getJsonApiEntityName;
