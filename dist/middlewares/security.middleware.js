"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityMiddleware = void 0;
const XSS = require("xss");
const boom_1 = require("@hapi/boom");
class SecurityMiddleware {
    constructor() {
    }
    /**
     * @private static - XSS filter nested properties in request
     *
     * @param content
     */
    static filterXSS(content) {
        for (let key in content) {
            if (typeof content[key] == "object")
                SecurityMiddleware.filterXSS(content[key]);
            else if (typeof content[key] == "string")
                content[key] = XSS.filterXSS(content[key]);
        }
    }
}
exports.SecurityMiddleware = SecurityMiddleware;
/**
 * Sanitize data before using|insertion
 * @inheritdoc https://www.npmjs.com/package/xss
 *
 * @param req Request object
 * @param res Response object
 * @param next Function
 */
SecurityMiddleware.sanitize = (req, res, next) => {
    try {
        SecurityMiddleware.filterXSS(req.body);
        next();
    }
    catch (e) {
        next(boom_1.default.expectationFailed(e.message));
    }
};
