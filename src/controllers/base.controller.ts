import {Connection, getConnection, getCustomRepository} from "typeorm";
import {cache, cleanupRouteCache} from "../services/cache.services";
//import {caching_enabled, typeorm as TypeORM} from ;
import {BaseRepository} from "../repositories/base.repository";
import {IController} from "../interfaces/IController.interface";

// const venant du fichier environnement.config.ts
/*const TypeORM = {
    type: process.env.TYPEORM_TYPE,
    name: process.env.TYPEORM_NAME,
    port: process.env.TYPEORM_PORT,
    host: process.env.TYPEORM_HOST,
    database: process.env.TYPEORM_DB,
    user: process.env.TYPEORM_USER,
    pwd: process.env.TYPEORM_PWD
};*/
//const caching_enabled = parseInt(process.env.REQUEST_CACHING);
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
    protected repository: BaseRepository<any>;

    /**
     * Super constructor
     * Retrieve database connection, and store it into connection
     * @constructor
     */
    constructor() {
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
