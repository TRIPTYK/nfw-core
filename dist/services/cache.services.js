"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupRouteCache = exports.cache = void 0;
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 180, checkperiod: 240 });
exports.cache = cache;
const cleanupRouteCache = (routeType) => {
    for (const key of cache.keys())
        if (key.includes(routeType))
            cache.del(key);
};
exports.cleanupRouteCache = cleanupRouteCache;
