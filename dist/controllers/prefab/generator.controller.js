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
exports.GeneratorController = void 0;
const HttpStatus = require("http-status");
const SocketIO = require("socket.io-client");
const registry_application_1 = require("../../application/registry.application");
const controller_decorator_1 = require("../../decorators/controller.decorator");
const add_column_1 = require("../../generator/commands/add-column");
const add_relation_1 = require("../../generator/commands/add-relation");
const delete_entity_1 = require("../../generator/commands/delete-entity");
const generate_entity_1 = require("../../generator/commands/generate-entity");
const remove_column_1 = require("../../generator/commands/remove-column");
const remove_relation_1 = require("../../generator/commands/remove-relation");
const project_1 = require("../../generator/utils/project");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const generator_validation_1 = require("../../validation/generator.validation");
const base_controller_1 = require("../base.controller");
/**
 * Generates app
 */
let GeneratorController = class GeneratorController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.socket = null;
        this.socket = SocketIO("http://localhost:3000", {
            query: {
                app: false,
            },
        });
        registry_application_1.ApplicationRegistry.on(registry_application_1.ApplicationLifeCycleEvent.Running, () => {
            this.socket.on("connect", () => {
                this.socket.emit("hello");
            });
            // removeRelation("user", "documents").then(() => project.save());
        });
    }
    async generateEntity(req, res) {
        await generate_entity_1.generateJsonApiEntity(req.params.name, {
            columns: req.body.columns,
            relations: req.body.relations,
        });
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async addEntityRelation(req, res) {
        await add_relation_1.addRelation(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async generateColumn(req, res) {
        await add_column_1.addColumn(req.params.name, req.body);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async do(req, res) {
        for (const column of req.body.columns) {
            if (column.action === "ADD") {
                await add_column_1.addColumn(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await remove_column_1.removeColumn(req.params.name, column);
            }
        }
        for (const column of req.body.relations) {
            if (column.action === "ADD") {
                await add_relation_1.addRelation(req.params.name, column);
            }
            if (column.action === "REMOVE") {
                await remove_relation_1.removeRelation(req.params.name, column);
            }
        }
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async deleteEntityColumn(req, res) {
        await remove_column_1.removeColumn(req.params.name, req.params.column);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async deleteEntityRelation(req, res) {
        await remove_relation_1.removeRelation(req.params.name, req.params.relation);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    async deleteEntity(req, res) {
        await delete_entity_1.deleteJsonApiEntity(req.params.name);
        res.sendStatus(HttpStatus.ACCEPTED);
        await this.sendMessageAndWaitResponse("app-save");
        await project_1.default.save();
        await this.sendMessageAndWaitResponse("app-recompile-sync");
        await this.sendMessageAndWaitResponse("app-restart");
    }
    sendMessageAndWaitResponse(type, data) {
        return new Promise((resolve, rej) => {
            this.socket.emit(type, data, (response) => {
                if (response !== "ok") {
                    rej(response);
                }
                else {
                    resolve(response);
                }
            });
        });
    }
};
__decorate([
    controller_decorator_1.Post("/entity/:name"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createEntity,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateEntity", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/relation"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createRelation,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "addEntityRelation", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/column"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.createColumn,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "generateColumn", null);
__decorate([
    controller_decorator_1.Post("/entity/:name/entity-actions"),
    controller_decorator_1.MethodMiddleware(validation_middleware_1.ValidationMiddleware, {
        schema: generator_validation_1.columnsActions,
        location: ["body"],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "do", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name/:column"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntityColumn", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name/relation/:relation"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntityRelation", null);
__decorate([
    controller_decorator_1.Delete("/entity/:name"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], GeneratorController.prototype, "deleteEntity", null);
GeneratorController = __decorate([
    controller_decorator_1.Controller("generate"),
    __metadata("design:paramtypes", [])
], GeneratorController);
exports.GeneratorController = GeneratorController;
