import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import { getRoutes } from "./get-routes";
import { join, normalize } from "path";
import { httpRequestMethods } from "../../enums/methods";

/**
 * Delete an endpoint of a specific route.
 * @param prefix Prefix of the route.
 * @param methodName Ts Method.
 */
export async function deleteEndpoint(
	prefix: string,
	methodName: string
): Promise<void> {
	const currentRoute = (await getRoutes()).find(
		r => r.prefix === prefix
	);

	prefix = /*getJsonApiEntityName(prefix)?.entityName.toLowerCase() ??*/ prefix;

	if (currentRoute?.type === "basic") {
		throw new Error("Subroute of basic routes can't be deleted.");
	}

	const subRoute = currentRoute.routes.find(
		(sub) => sub.methodName === methodName
	);

	if (!currentRoute) {
		throw new Error(`Prefix "${prefix}" does not exist.`);
	}

	if (!subRoute) {
		throw new Error(`Method "${methodName}" does not exist.`);
	}

	const controller = resources(prefix).find((r) => r.template === "controller");

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);

	const { classPrefixName } = getEntityNaming(prefix);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const routeClass = controllerFile.getClass(`${classPrefixName}Controller`);

	if (!routeClass) {
		throw new Error("This class does not exit");
	}

	const classMethod = routeClass.getMethod(subRoute.methodName);

	classMethod.getDecorator(
		subRoute.methodName.charAt(0).toUpperCase() + subRoute.methodName.slice(1)
	);
	classMethod.remove();
	controllerFile.fixMissingImports();
}

export async function deleteEndpointByUri(prefix: string, subroute: string, requestMethod: string) {

	requestMethod = requestMethod.toUpperCase();
	subroute = normalize(`/${subroute}`);

	if(!httpRequestMethods.includes(requestMethod))
		throw new Error(`${requestMethod} doesn't exist or isn't compatible yet. Use ${httpRequestMethods} instead.`);
	
	const currentPrefix = (await getRoutes()).find(r => r.prefix === prefix);

	if(!currentPrefix)
		throw new Error(`Prefix "${prefix} doesn't exist."`);
	
	const currentRoute = currentPrefix.routes
		.find(sub => sub.path === subroute && sub.requestMethod === requestMethod.toLowerCase());

	if(!currentRoute)
		throw new Error(`Route "${join(prefix, subroute)}" (${requestMethod}) doesn't exist.`);
	
	await deleteEndpoint(prefix, currentRoute.methodName);
}
