import project from "../utils/project";
import {
	GlobalRouteDefinition,
	RouteDefinition,
	routeType,
} from "../../interfaces/routes.interface";
import pluralize from "pluralize";
import { jsonApiRoutes } from "../../enums/routes";
import { httpRequestMethods } from "../../enums";

export async function getRoutes(): Promise<GlobalRouteDefinition[]> {
	
	const regController = /Controller/gm;
	const regQuotes = /"/gm;

	const typeByController: {[key: string]: routeType} = {
		JsonApiController: "entity",
		GeneratedController: "generated",
		Controller: "basic"
	}

	const controllerFiles = [
		...project.getSourceFiles("src/api/controllers/*.controller.ts"),
		...project.getSourceFiles("node_modules/@triptyk/nfw-core/src/controllers/prefab/*.controller.ts")
	];

	const entity: GlobalRouteDefinition[] = [];

	for (const controller of controllerFiles) {
		
		const controllerClass = controller.getClasses()
			.find(c => c.getName().match(regController));
		const controllerDecorator = controllerClass.getDecorators()
			.find(c => c.getName().match(regController));

		if(controllerClass) {
			let prefix = controllerDecorator.getArguments()[0]
				.getText().toLowerCase().replace(regQuotes, '');
			const type: routeType = typeByController[controllerDecorator.getName()];
			prefix = (type === "entity") ? pluralize(prefix) : prefix;
			
			let routes: RouteDefinition[] = controllerClass.getMethods()
			.filter(m => m.getDecorators().length > 0)
			.map(m => {
				const deco = m.getDecorators()[0];
				const arg = deco.getArguments()[0];
				if(httpRequestMethods.includes(deco.getName().toUpperCase())) {
					return {
						path: (arg)? arg.getText().replace(regQuotes, '') : `/${m.getName()}`,
						requestMethod: deco.getName().toLowerCase(),
						methodName: m.getName()
					} as RouteDefinition;
				}
			})
			.filter(route => route);
			
			if(type === "entity") {
				routes = [
					...routes,
					...jsonApiRoutes.map(route => {
						return {
							path: route.path,
							requestMethod: route.methodType,
							methodName: route.method
						} as RouteDefinition;
					})
				];
			}

			entity.push({ prefix, type, routes });
		}
	}

	return entity;
}
