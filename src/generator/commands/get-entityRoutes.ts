import { ArrayLiteralExpression, PropertyAccessExpression } from "ts-morph";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import * as pluralize from "pluralize";
import * as pascalcase from "pascalcase";

export async function getEntityRoutes(
	entity: string,
	routes?: any
): Promise<any> {
	const entityName = pascalcase(pluralize.singular(entity));
	const controller = resources(entityName).find(
		(r) => r.template === "controller"
	);

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);
	const { classPrefixName } = getEntityNaming(entityName);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const controllerClass = controllerFile.getClass(
		`${classPrefixName}Controller`
	);

	if (!controllerClass) {
		throw new Error("This class does not exit");
	}
	const routeRoleList = [];
	for (const route of routes) {
		const method = controllerClass.getMethod(route.methodName);

		const array = [];
		if (method) {
			const decorators = method.getDecorator("JsonApiMethodMiddleware");

			if (decorators) {
				const args = decorators.getArguments()[1] as ArrayLiteralExpression;
				if (decorators.getArguments()[0].getFullText() === "AuthMiddleware") {
					if (args) {
						args.getElements().forEach((e) => {
							const tmp = e as PropertyAccessExpression;

							array.push(tmp.getName());
						});
					}
				}
			}
		}

		routeRoleList.push({
			methodName: route.methodName,
			requestMethod: route.requestMethod,
			path: route.path,
			roles: array,
		});
	}

	return routeRoleList;
}
