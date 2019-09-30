"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONAPISerializer = require("json-api-serializer");
const pluralize_1 = require("pluralize");
class BaseSerializer {
    /**
     * @param type Entity type
     * @param options
     */
    constructor(type, options = {}) {
        /**
         * Serialize a payload to json-api format
         *
         * @param payload Payload
         * @param schema
         * @param params
         */
        this.serialize = (payload, schema = null, params = {}) => {
            return this.serializer.serialize(this.type, payload, schema, params);
        };
        /**
         * Deserialize a payload from json-api format
         *
         * @param req
         */
        this.deserialize = (req) => {
            return this.serializer.deserialize(this.type, req.body);
        };
        /**
         *  Replace page number parameter value in given URL
         */
        this.replacePage = (url, newPage) => {
            return url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`);
        };
        this.setupLinks = (data, serializerParams) => {
            if (serializerParams.hasPaginationEnabled()) {
                const { total, request } = serializerParams.getPaginationData();
                const page = parseInt(request.query.page.number);
                const size = request.query.page.size;
                const baseUrl = `/api/${process.env.API_VERSION}`;
                const max = Math.ceil(total / size);
                data["topLevelLinks"] = {
                    self: () => `${baseUrl}/${this.type}${request.url}`,
                    next: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page + 1 > max ? max : page + 1)}`,
                    prev: () => `${baseUrl}/${this.type}${this.replacePage(request.url, page - 1 < 1 ? page : page - 1)}`,
                    last: () => `${baseUrl}/${this.type}${this.replacePage(request.url, max)}`,
                    first: () => `${baseUrl}/${this.type}${this.replacePage(request.url, 1)}`
                };
            }
            // link for entity
            data['links'] = {
                self: (data) => {
                    return `/api/${process.env.API_VERSION}/${this.type}s/${data.id}`;
                }
            };
            //link for relationship
            for (let key in data['relationships']) {
                data['relationships'][key]['links'] = {
                    self: (data) => {
                        return `/api/${process.env.API_VERSION}/${pluralize_1.plural(this.type)}/${data.id}/relationships/${key}`;
                    },
                    related: (data) => {
                        return `/api/${process.env.API_VERSION}/${pluralize_1.plural(this.type)}/${data.id}/${key}`;
                    }
                };
            }
        };
        this.serializer = new JSONAPISerializer(Object.assign({ convertCase: "kebab-case", unconvertCase: "camelCase" }, options));
        this.type = type;
    }
    /**
     *
     * @param relationshipType
     * @param payload
     * @param schema
     */
    serializeRelationships(relationshipType, payload, schema = 'default') {
        return this.serializer.serializeRelationship(relationshipType, schema, null, payload);
    }
    /**
     *
     * @param schema
     */
    getSchemaData(schema = "default") {
        return this.serializer.schemas[this.type][schema];
    }
}
exports.BaseSerializer = BaseSerializer;
BaseSerializer.whitelist = [];
