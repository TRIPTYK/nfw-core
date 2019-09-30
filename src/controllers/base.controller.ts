import {Connection, getConnection, getCustomRepository} from "typeorm";
import {cache, cleanupRouteCache} from "../services/cache.services";
import {IController} from "../interfaces/IController.interface";
import {JsonApiRepositoryInterface} from "..";


/**
 * Main controller contains properties/methods
 * @abstract
 */
abstract class BaseController implements IController {

    /**
     * Store the TypeORM current connection to database
     * @property Connection
     */
    protected connection: Connection;
    protected repository: JsonApiRepositoryInterface<any>;

    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    protected constructor() {
        this.connection = getConnection(process.env.TYPEORM_NAME);
    }

    public method = (method) => async (req, res, next) => {
        try {
            this.beforeMethod();

            if (process.env.REQUEST_CACHING && req.method === "GET") {
                const cached = cache.get(req.originalUrl);
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

                    cleanupRouteCache(routeType);
                } else {
                    cache.set(req.originalUrl, extracted);
                }
            }

            if (!res.headersSent)
                res.json(extracted);
        } catch (e) {
            next(e);
        }
    };

    protected beforeMethod() {

    }
}

export {BaseController};
