"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = require("@hapi/boom");
const express_validator_1 = require("express-validator");
const typeorm_1 = require("typeorm");
class BaseMiddleware {
    constructor(serializer) {
        this.handleValidation = (schema, location = ["body"]) => async (req, _res, next) => {
            const validationChain = express_validator_1.checkSchema(schema, location);
            const res = await Promise.all(validationChain.map(validation => validation.run(req)));
            const errors = [];
            res.forEach((r) => {
                if (r.errors.length !== 0)
                    errors.push(r.errors);
            });
            if (errors.length !== 0) {
                const error = boom_1.default.badRequest('Validation error');
                error['errors'] = errors;
                return next(error);
            }
            return next();
        };
        // TODO : Better handle async for each relations
        this.deserializeRelationships = async (recipient, payload, specificRelations = []) => {
            const schemaData = this.serializer.getSchemaData();
            let relations = schemaData['relationships'];
            if (specificRelations === []) {
                relations = specificRelations.map((rel) => relations[rel]);
            }
            for (let originalRel in relations) {
                if (payload.hasOwnProperty(originalRel)) { //only load when present
                    let rel = relations[originalRel];
                    const modelName = rel['type'];
                    let importModel = await Promise.resolve().then(() => require(`../models/${modelName}.model`));
                    importModel = Object.keys(importModel)[0];
                    let relationData = null;
                    if (typeof payload[originalRel] === "string")
                        relationData = await typeorm_1.getRepository(importModel).findOne(payload[originalRel]);
                    else if (Array.isArray(payload[originalRel]))
                        relationData = await typeorm_1.getRepository(importModel).findByIds(payload[originalRel]);
                    if (!relationData)
                        throw boom_1.default.notFound('Related object not found');
                    recipient[originalRel] = relationData;
                }
            }
        };
        /**
         * Deserialize a POST-PUT-PATCH-DELETE request
         *
         * @param nullEqualsUndefined
         * @param withRelationships
         * @param specificRelationships
         */
        this.deserialize = ({ nullEqualsUndefined = false, withRelationships = true, specificRelationships = [] } = {}) => async (req, _res, next) => {
            try {
                if (['GET', 'DELETE'].includes(req.method))
                    return next();
                if (!req.body.data || !req.body.data.attributes)
                    return next();
                let fields = this.serializer.deserialize(req);
                req.body = {};
                for (let key in fields) {
                    if (key !== 'id')
                        if (nullEqualsUndefined && fields[key] === null)
                            delete req.body[key];
                        else
                            req.body[key] = fields[key];
                    else
                        delete req.body[key];
                }
                if (withRelationships)
                    await this.deserializeRelationships(req.body, req.body, specificRelationships);
                return next();
            }
            catch (e) {
                return next(e);
            }
        };
        this.serializer = serializer;
    }
}
exports.BaseMiddleware = BaseMiddleware;
