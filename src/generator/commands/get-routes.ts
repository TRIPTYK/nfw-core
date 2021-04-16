import project from "../utils/project";
import {
	GlobalRouteDefinition,
	reqestType,
	RouteDefinition,
	routeType,
} from "../../interfaces/routes.interface";
import * as pluralize from "pluralize";

export async function getRoutes(): Promise<any> {
	const validDecorator = ["Get", "Post", "Patch", "Delete"];

	const controllerFiles = project.getSourceFiles(
		"src/api/controllers/*.controller.ts"
	);

	const entity: GlobalRouteDefinition[] = [];
	for (const controller of controllerFiles) {
		const classes = controller.getClasses();

		for (const classe of classes) {
			let prefix = classe.getName().replace("Controller", "").toLowerCase();
			const classDecorators = classe.getDecorators();
			const arrayNameDecorator = [];
			for (const classDecorator of classDecorators) {
				arrayNameDecorator.push(classDecorator.getName());
			}
			let type: routeType;
			if (arrayNameDecorator.includes("JsonApiController")) {
				type = "entity";
				prefix = pluralize(prefix);
			} else if (arrayNameDecorator.includes("GeneratedController")) {
				type = "generated";
			} else {
				type = "basic";
			}

			const routes: RouteDefinition[] = [];
			const methods = classe.getMethods();
			for (const method of methods) {
				const decorators = method.getDecorators();

				for (const decorator of decorators) {
					if (validDecorator.includes(decorator.getName())) {
						const args = decorator.getArguments();

						for (const arg of args) {
							routes.push({
								path: arg.getFullText(),
								requestMethod: decorator.getName().toLowerCase() as reqestType,
								methodName: method.getName(),
							});
						}
					}
				}
			}
			entity.push({ prefix, type, routes });
		}
	}

	return entity;
}
