"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const registry_application_1 = require("../../application/registry.application");
const controller_decorator_1 = require("../../decorators/controller.decorator");
const typeorm_service_1 = require("../../services/typeorm.service");
const base_controller_1 = require("../base.controller");
/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
let MetadataController = class MetadataController extends base_controller_1.default {
    constructor(typeormConnection) {
        super();
        this.typeormConnection = typeormConnection;
    }
    getSupportedTypes() {
        const connection = this.typeormConnection.connection;
        return connection.driver.supportedDataTypes;
    }
    async countEntityRecords(req, res) {
        const { entity } = req.params;
        const entityTarget = this.findEntityMetadataByName(entity);
        return {
            count: await typeorm_1.getRepository(entityTarget.target).count()
        };
    }
    getEntityMeta(req, res) {
        return this.entityMetadaBuilder(this.findEntityMetadataByName(req.params.entity));
    }
    getEntities(req, res) {
        return this.getJsonApiEntities().map((table) => this.entityMetadaBuilder(table));
    }
    getJsonApiEntities() {
        return this.typeormConnection.connection.entityMetadatas.filter((table) => registry_application_1.ApplicationRegistry.entities.includes(table.target));
    }
    findEntityMetadataByName(name) {
        const result = this.getJsonApiEntities().filter((table) => table.name.toLowerCase() === name.toLowerCase());
        return result.length ? result[0] : null;
    }
    entityMetadaBuilder(table) {
        return {
            id: table.name,
            entityName: table.name,
            table: table.tableName,
            columns: table.ownColumns
                .filter((c) => !c.relationMetadata)
                .map((column) => {
                return {
                    property: column.propertyName,
                    type: this.typeormConnection.connection.driver.normalizeType(column),
                    default: this.typeormConnection.connection.driver.normalizeDefault(column),
                    width: column.width,
                    length: column.length,
                    isPrimary: column.isPrimary,
                    isNullable: column.isNullable,
                    enumValues: column.enum
                };
            }),
            relations: table.ownRelations.map((rel) => {
                return {
                    propertyName: rel.propertyName,
                    inverseEntityName: rel.inverseEntityMetadata.name,
                    inversePropertyName: rel.inverseRelation.propertyName,
                    relationType: rel.relationType,
                    isNullable: rel.isNullable
                };
            })
        };
    }
};
__decorate([
    controller_decorator_1.Get("/types"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetadataController.prototype, "getSupportedTypes", null);
__decorate([
    controller_decorator_1.Get("/:entity/count"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MetadataController.prototype, "countEntityRecords", null);
__decorate([
    controller_decorator_1.Get("/:entity"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MetadataController.prototype, "getEntityMeta", null);
__decorate([
    controller_decorator_1.Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], MetadataController.prototype, "getEntities", null);
MetadataController = __decorate([
    controller_decorator_1.Controller("meta"),
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [typeorm_service_1.default])
], MetadataController);
exports.default = MetadataController;
