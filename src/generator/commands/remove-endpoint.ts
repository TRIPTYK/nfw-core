import { ApplicationRegistry } from "../../application";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import { getJsonApiEntityName } from "../utils/naming";

/**
 * Remove a endpoint of a specific route.
 * @param prefix Prefix of the route.
 * @param methodName Method (GET, POST, etc).
 */
export async function removeEndpoint(
	prefix: string,
	methodName: string
): Promise<void> {
	const currentRoute = ApplicationRegistry.application.Routes.find(
		(r) => r.prefix === prefix
	);

	prefix = getJsonApiEntityName(prefix)?.entityName.toLowerCase() ?? prefix;

	if (currentRoute?.type === "basic") {
		throw new Error("Subroute of basic routes can't be deleted.");
	}

	const subRoute = currentRoute.routes.find(
		(sub) => sub.methodName === methodName
	);

	if (!currentRoute) {
		throw new Error(`"${prefix}" does not exist.`);
	}

	if (!subRoute) {
		throw new Error(`"${methodName}" does not exist.`);
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
