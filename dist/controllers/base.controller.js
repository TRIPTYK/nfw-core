"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const registry_application_1 = require("../application/registry.application");
class BaseController {
    constructor() {
        registry_application_1.ApplicationRegistry.registerController(this);
        this.name = Reflect.getMetadata("routeName", this);
    }
    callMethod(methodName) {
        const middlewareFunction = async (req, res, next) => {
            try {
                const response = await this[methodName](req, res);
                if (!res.headersSent) {
                    res.send(response);
                }
            }
            catch (e) {
                return next(e);
            }
        };
        return middlewareFunction.bind(this);
    }
    init() {
        // eslint-disable-next-line no-useless-return
        return;
    }
}
exports.BaseController = BaseController;
