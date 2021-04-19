import project from "../generator/utils/project";

const decorators = project
	.getSourceFile("node_modules/@triptyk/nfw-core/src/decorators/controller.decorator.ts")
	.getFunctions();

/**
 * All Http request methods.
 */
export const allHttpRequestMethods = [
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
export const httpRequestMethods = decorators
	.filter(d => allHttpRequestMethods.includes(d.getName().toUpperCase()))
	.map(d => d.getName().toUpperCase());
	