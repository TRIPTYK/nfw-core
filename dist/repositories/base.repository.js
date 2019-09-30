"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const SqlString = require("sqlstring");
const boom_1 = require("@hapi/boom");
const dashify = require("dashify");
const JSONAPISerializer = require("json-api-serializer");
const pluralize_1 = require("pluralize");
/**
 * Base Repository class , inherited for all current repositories
 */
let BaseRepository = class BaseRepository extends typeorm_1.Repository {
    /**
     * Handle request and transform to SelectQuery , conform to JSON-API specification : https://jsonapi.org/format/.
     * <br> You can filter the features you want to use by using the named parameters.
     *
     */
    jsonApiRequest(query, allowedIncludes = [], { allowIncludes = true, allowSorting = true, allowPagination = true, allowFields = true, allowFilters = false } = {}) {
        const currentTable = this.metadata.tableName;
        const splitAndFilter = (string) => string.split(',').map(e => e.trim()).filter(string => string != ''); //split parameters and filter empty strings
        const splitAndFilterPlus = (string) => string.split('+').map(e => e.trim()).filter(string => string != ''); //split sub-parameters and filter empty strings
        let queryBuilder = this.createQueryBuilder(currentTable);
        let select = [`${currentTable}.id`];
        /**
         * Check if include parameter exists
         * An endpoint MAY also support an include request parameter to allow the client to customize which related resources should be returned.
         * @ref https://jsonapi.org/format/#fetching-includes
         */
        if (allowIncludes && query.include) {
            let includes = splitAndFilter(query.include);
            includes.forEach((include) => {
                select.push(`${include}.id`); // push to select include , because id is always included
                if (allowedIncludes.indexOf(include) > -1) {
                    let property, alias;
                    if (include.indexOf(".") !== -1) {
                        property = include;
                    }
                    else {
                        property = `${currentTable}.${include}`;
                    }
                    alias = dashify(include);
                    queryBuilder.leftJoinAndSelect(property, alias);
                }
                else {
                    throw boom_1.default.expectationFailed(`Relation with ${include} not authorized`); //TODO : XSS ?
                }
            });
        }
        /**
         * Check if fields parameter exists
         * A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
         * @ref https://jsonapi.org/format/#fetching-sparse-fieldsets
         */
        if (allowFields && query.fields) {
            /**
             * Recursive function to populate select statement with fields array
             */
            let fillFields = (props, parents = []) => {
                if (typeof props === "string") {
                    if (!parents.length)
                        parents = [currentTable];
                    splitAndFilter(props)
                        .forEach(elem => select.push(`${parents.join('.')}.${elem}`));
                }
                else {
                    for (let index in props) {
                        let property = props[index];
                        let copy = parents.slice(); //slice makes a copy
                        if (+index !== +index)
                            copy.push(index); // fast way to check if string is number
                        fillFields(property, copy);
                    }
                }
            };
            fillFields(query.fields);
            queryBuilder.select(select); // select parameters are escaped by default , no need to escape sql string
        }
        /**
         * Check if sort parameter exists
         * A server MAY choose to support requests to sort resource collections according to one or more criteria (“sort fields”).
         * @ref https://jsonapi.org/format/#fetching-sorting
         */
        if (allowSorting && query.sort) {
            let sortFields = splitAndFilter(query.sort); //split parameters and filter empty strings
            // need to use SqlString.escapeId in order to prevent SQL injection on orderBy()
            sortFields.forEach((field) => {
                if (field[0] == "-") { // JSON-API convention , when sort field starts with '-' order is DESC
                    queryBuilder.orderBy(SqlString.escapeId(field.substr(1)), "DESC"); //
                }
                else {
                    queryBuilder.orderBy(SqlString.escapeId(field), "ASC");
                }
            });
        }
        /**
         * Check if pagination is enabled
         * A server MAY choose to limit the number of resources returned in a response to a subset (“page”) of the whole set available.
         * @ref https://jsonapi.org/format/#fetching-pagination
         */
        if (allowPagination && query.page && query.page.number && query.page.size) {
            let number = query.page.number;
            let size = query.page.size;
            queryBuilder
                .skip((number - 1) * size)
                .take(size);
        }
        if (allowFilters && query.filter) {
            let queryBrackets = new typeorm_1.Brackets(qb => {
                for (let key in query.filter) {
                    let filtered = splitAndFilter(query.filter[key]);
                    filtered.forEach((e) => {
                        let [strategy, value] = e.split(":");
                        // TODO : fix params not working with TypeORM where
                        /*if (strategy == "like") {
                            qb.andWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                        }
                        if (strategy == "eq") {
                            qb.andWhere(SqlString.format(`?? = ?`, [key, value]));
                        }
                        if (strategy == "noteq") {
                            qb.andWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                        }
                        if (strategy == "andin") {
                            qb.andWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilterPlus(value)]))
                        }
                        if (strategy == "notin") {
                            qb.andWhere(SqlString.format(`?? NOT IN (?)`, [key, splitAndFilterPlus(value)]))
                        }

                        if (strategy == "orlike") {
                            qb.orWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                        }
                        if (strategy == "oreq") {
                            qb.orWhere(SqlString.format(`?? = ?`, [key, value]));
                        }
                        if (strategy == "ornoteq") {
                            qb.orWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                        }
                        if (strategy == "orin") {
                            qb.orWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilterPlus(value)]))
                        }*/
                        switch (strategy) {
                            case "like":
                                qb.andWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                                break;
                            case "eq":
                                qb.andWhere(SqlString.format(`?? = ?`, [key, value]));
                                break;
                            case "noteq":
                                qb.andWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                                break;
                            case "andin":
                                qb.andWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilterPlus(value)]));
                                break;
                            case "notin":
                                qb.andWhere(SqlString.format(`?? NOT IN (?)`, [key, splitAndFilterPlus(value)]));
                                break;
                            case "orlike":
                                qb.orWhere(SqlString.format(`?? LIKE ?`, [key, value]));
                                break;
                            case "oreq":
                                qb.orWhere(SqlString.format(`?? = ?`, [key, value]));
                                break;
                            case "ornoteq":
                                qb.orWhere(SqlString.format(`NOT ?? = ?`, [key, value]));
                                break;
                            case "orin":
                                qb.orWhere(SqlString.format(`?? IN (?)`, [key, splitAndFilterPlus(value)]));
                                break;
                        }
                    });
                }
            });
            queryBuilder.where(queryBrackets);
        }
        return queryBuilder;
    }
    /**
     * Shortcut function to make a JSON-API findOne request on id key
     */
    jsonApiFindOne(req, id, allowedIncludes = [], options) {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .where(`${this.metadata.tableName}.id = :id`, { id })
            .getOne();
    }
    /**
     * Shortcut function to make a JSON-API findMany request with data used for pagination
     */
    jsonApiFind(req, allowedIncludes = [], options) {
        return this.jsonApiRequest(req.query, allowedIncludes, options)
            .getManyAndCount();
    }
    /**
     *
     * @param req
     * @param serializer
     */
    async fetchRelated(req, serializer) {
        const { id, relation } = req.params;
        let type = serializer.getSchemaData()['relationships'];
        if (!type[relation])
            throw boom_1.default.notFound('Relation not found');
        type = type[relation]['type'];
        let serializerImport = await Promise.resolve().then(() => require(`../serializers/${type}.serializer`));
        serializerImport = Object.values(serializerImport)[0];
        const rel = await this.findOne(id, { relations: [relation] });
        if (!rel)
            throw boom_1.default.notFound();
        return new serializerImport().serialize(rel[relation]);
    }
    /**
     *
     * @param req
     */
    async addRelationshipsFromRequest(req) {
        const { id, relation } = req.params;
        let user = await this.findOne(id);
        if (!user)
            throw boom_1.default.notFound();
        let serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);
        let relations = null;
        if (Array.isArray(req.body)) {
            relations = [];
            for (const key in req.body)
                relations.push(req.body[key].id);
        }
        else {
            relations = req.body.id;
        }
        const qb = this.createQueryBuilder()
            .relation(relation)
            .of(user);
        if (pluralize_1.isPlural(relation))
            return qb.add(relations);
        else
            return qb.set(relations);
    }
    /**
     *
     * @param req
     */
    async updateRelationshipsFromRequest(req) {
        const { id, relation } = req.params;
        let user = await this.findOne(id);
        if (!user)
            throw boom_1.default.notFound();
        let serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);
        let relations = null;
        if (Array.isArray(req.body)) {
            relations = [];
            for (const key in req.body)
                relations.push(req.body[key].id);
        }
        else {
            relations = req.body.id;
        }
        user[relation] = await (pluralize_1.isPlural(relation) ?
            this.findByIds(relations) :
            this.findOne(relations));
        return this.save(user);
    }
    /**
     *
     * @param req
     */
    async removeRelationshipsFromRequest(req) {
        const { id, relation } = req.params;
        let user = await this.findOne(id);
        if (!user)
            throw boom_1.default.notFound();
        let serializer = new JSONAPISerializer({
            convertCase: "kebab-case",
            unconvertCase: "camelCase"
        });
        serializer.register(relation, {});
        req.body = serializer.deserialize(relation, req.body);
        let relations = null;
        if (Array.isArray(req.body)) {
            relations = [];
            for (const key in req.body)
                relations.push(req.body[key].id);
        }
        else {
            relations = req.body.id;
        }
        const qb = this.createQueryBuilder()
            .relation(relation)
            .of(user);
        if (pluralize_1.isPlural(relation))
            return qb.remove(relations);
        else
            return qb.set(null);
    }
    /**
     *
     * @param req
     * @param serializer
     */
    async fetchRelationshipsFromRequest(req, serializer) {
        const { id, relation } = req.params;
        const user = await this.createQueryBuilder('relationQb')
            .leftJoin(`relationQb.${relation}`, 'relation')
            .select(['relationQb.id', 'relation.id'])
            .where("relationQb.id = :id", { id })
            .getOne();
        if (!user)
            throw boom_1.default.notFound();
        const serialized = serializer.serialize(user);
        return serialized['data']['relationships'][relation];
    }
};
BaseRepository = __decorate([
    typeorm_1.EntityRepository()
], BaseRepository);
exports.BaseRepository = BaseRepository;
