"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const cache_services_1 = require("../services/cache.services");
/**
 * Main controller contains properties/methods
 * @abstract
 */
class BaseController {
    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    constructor() {
        this.method = (method) => async (req, res, next) => {
            try {
                this.beforeMethod();
                if (process.env.REQUEST_CACHING && req.method === "GET") {
                    const cached = cache_services_1.cache.get(req.originalUrl);
                    if (cached !== undefined) {
                        res.json(cached);
                        return;
                    }
                }
                const extracted = await this[method](req, res, next);
                if (process.env.REQUEST_CACHING) {
                    if (['PATCH', 'DELETE', 'PUT', 'POST'].includes(req.method)) {
                        let routeType = req.originalUrl.split('?')[0]
                            .replace(/\/api\/v1\/(?:admin\/)?/, '');
                        cache_services_1.cleanupRouteCache(routeType);
                    }
                    else {
                        cache_services_1.cache.set(req.originalUrl, extracted);
                    }
                }
                if (!res.headersSent)
                    res.json(extracted);
            }
            catch (e) {
                next(e);
            }
        };
        this.connection = typeorm_1.getConnection(process.env.TYPEORM_NAME);
    }
    beforeMethod() {
    }
}
exports.BaseController = BaseController;
