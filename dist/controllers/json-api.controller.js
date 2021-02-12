"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJsonApiController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const Boom = require("@hapi/boom");
const HttpStatus = require("http-status");
const registry_application_1 = require("../application/registry.application");
const pagination_response_1 = require("../responses/pagination.response");
const response_response_1 = require("../responses/response.response");
const base_controller_1 = require("./base.controller");
class BaseJsonApiController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.entity = Reflect.getMetadata("entity", this);
        this.name = Reflect.getMetadata("name", this.entity);
        this.serializer = registry_application_1.ApplicationRegistry.serializerFor(this.entity);
        this.repository = registry_application_1.ApplicationRegistry.repositoryFor(this.entity);
    }
    callMethod(methodName) {
        return async (req, res, next) => {
            try {
                const response = await this[methodName](req, res);
                if (!res.headersSent) {
                    const useSchema = Reflect.getMetadata("schema-use", this, methodName) ?? "default";
                    if (response instanceof pagination_response_1.PaginationResponse) {
                        const serialized = await this.serializer.serialize(response.body, useSchema, response.paginationData);
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    }
                    else if (response instanceof response_response_1.Response) {
                        const serialized = await this.serializer.serialize(response.body, useSchema, {
                            url: req.url,
                        });
                        res.status(response.status);
                        res.type(response.type);
                        res.send(serialized);
                    }
                    else {
                        const serialized = await this.serializer.serialize(response, useSchema, {
                            url: req.url,
                        });
                        res.status(200);
                        res.type("application/vnd.api+json");
                        res.send(serialized);
                    }
                }
            }
            catch (e) {
                return next(e);
            }
        };
    }
    async list(req, _res) {
        const params = this.parseJsonApiQueryParams(req.query);
        const [entities, count] = await this.repository
            .jsonApiRequest(params)
            .getManyAndCount();
        return req.query.page
            ? new pagination_response_1.PaginationResponse(entities, {
                total: count,
                page: params.page.number,
                size: params.page.size,
                url: req.url,
            })
            : entities;
    }
    async get(req, _res) {
        const params = this.parseJsonApiQueryParams(req.query);
        const entity = await this.repository
            .jsonApiRequest(params)
            .andWhere(`${this.repository.metadata.tableName}.id = :id`, {
            id: req.params.id,
        })
            .getOne();
        if (!entity) {
            throw Boom.notFound();
        }
        return entity;
    }
    async create(req, _res) {
        const entity = this.repository.create(req.body);
        const saved = await this.repository.save(entity);
        return new response_response_1.Response(saved, {
            status: 201,
            type: "application/vnd.api+json",
        });
    }
    async update(req, _res) {
        let saved = await this.repository.preload({
            ...req.body,
            ...{ id: req.params.id },
        });
        if (saved === undefined) {
            throw Boom.notFound();
        }
        saved = await this.repository.save(saved);
        return saved;
    }
    async remove(req, res) {
        const entity = await this.repository.findOne(req.params.id);
        if (!entity) {
            throw Boom.notFound();
        }
        await this.repository.remove(entity);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    async fetchRelationships(req, res) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;
        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }
        const relatedIds = await this.repository.fetchRelationshipsFromRequest(relation, req.params.id, this.parseJsonApiQueryParams(req.query));
        res.type("application/vnd.api+json");
        return res.json(await registry_application_1.ApplicationRegistry.serializerFor(otherEntityMetadata.target).serialize(relatedIds, "relationships", {
            id: req.params.id,
            thisType: this.name,
            relationName: relation,
            url: req.url,
        }));
    }
    async fetchRelated(req, res) {
        const relation = req.params.relation;
        const otherEntityMetadata = this.repository.metadata.findRelationWithPropertyPath(relation)?.inverseEntityMetadata;
        if (!otherEntityMetadata) {
            throw Boom.notFound();
        }
        const useSchema = Reflect.getMetadata("schema-use", this, "fetchRelated") ?? "default";
        res.type("application/vnd.api+json");
        return res.json(await registry_application_1.ApplicationRegistry.serializerFor(otherEntityMetadata.target).serialize(await this.repository.fetchRelated(relation, req.params.id, this.parseJsonApiQueryParams(req.query)), useSchema, {
            url: req.url,
        }));
    }
    async addRelationships(req, res) {
        const { relation, id } = req.params;
        await this.repository.addRelationshipsFromRequest(relation, id, req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    async updateRelationships(req, res) {
        const { relation, id } = req.params;
        await this.repository.updateRelationshipsFromRequest(relation, id, req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    async removeRelationships(req, res) {
        const { relation, id } = req.params;
        await this.repository.removeRelationshipsFromRequest(relation, id, req.body.data);
        res.sendStatus(HttpStatus.NO_CONTENT).end();
    }
    parseJsonApiQueryParams(query) {
        return {
            includes: query.include ? query.include.split(",") : null,
            sort: query.sort ? query.sort.split(",") : null,
            fields: query.fields ?? null,
            page: query.page ?? null,
            filter: query.filter ?? null,
        };
    }
}
exports.BaseJsonApiController = BaseJsonApiController;
