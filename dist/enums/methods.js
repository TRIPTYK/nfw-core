"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequestMethods = exports.allHttpRequestMethods = void 0;
// const decorators = project
// 	.getSourceFile("node_modules/@triptyk/nfw-core/src/decorators/controller.decorator.ts")
// 	.getFunctions();
/**
 * All Http request methods.
 */
exports.allHttpRequestMethods = [
    "GET",
    "PUT",
    "POST",
    "DELETE",
    "PATCH",
    "COPY",
    "HEAD",
    "OPTIONS",
    "LINK",
    "UNLINK",
    "PURGE",
    "LOCK",
    "UNLOCK",
    "PROFIND",
    "VIEW",
];
/**
 * Http request methods compatibles with NFW.
 */
exports.httpRequestMethods = exports.allHttpRequestMethods; /*decorators
    .filter(d => allHttpRequestMethods.includes(d.getName().toUpperCase()))
    .map(d => d.getName().toUpperCase());*/
