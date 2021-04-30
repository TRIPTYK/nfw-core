import { request } from "http";
import {
	ArrayLiteralExpression,
	PropertyAccessExpression,
	Scope,
} from "ts-morph";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import * as pascalcase from "pascalcase";

export async function addPerms(element: any): Promise<void> {
	const controller = resources(element.entity).find(
		(r) => r.template === "controller"
	);

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);

	const { classPrefixName } = getEntityNaming(element.entity);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const controllerClass = controllerFile.getClass(
		`${classPrefixName}Controller`
	);

	if (!controllerClass) {
		throw new Error("This class does not exit");
	}

	if (element.methodName) {
		const controllerMethod = controllerClass.getMethod(element.methodName);

		if (controllerMethod) {
			const decorators = controllerMethod.getDecorator(
				"JsonApiMethodMiddleware"
			);
			if (!decorators) {
				controllerMethod
					.addDecorator({
						name: "JsonApiMethodMiddleware<AuthMiddlewareArgs>",
						arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
					})
					.setIsDecoratorFactory(true);
			} else {
				let args = decorators.getArguments()[1] as ArrayLiteralExpression;
				
				if(!args) {
					decorators.addArgument("[]");
					args = decorators.getArguments()[1] as ArrayLiteralExpression;
				}

				for (const e of args.getElements()) {
					const tmp = e as PropertyAccessExpression;

					if (element.role === tmp.getName()) {
						throw new Error(`${element.role} already exist`);
					}
				}
				
				args.addElement(`Roles.${element.role}`);
			}
		} else {
			const controllerMethod = controllerClass.addMethod({
				name: element.methodName,
				returnType: "any",
				scope: Scope.Public,
				parameters: [{ name: "req", type: "Request" }, { name: "res" }],
			});

			controllerMethod
				.addDecorator({
					name: pascalcase(element.requestMethod),
					arguments: [`"${element.path}"`],
				})
				.setIsDecoratorFactory(true);

			controllerMethod
				.addDecorator({
					name: "JsonApiMethodMiddleware<AuthMiddlewareArgs>",
					arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
				})
				.setIsDecoratorFactory(true);

			controllerMethod.setBodyText((writer) =>
				writer.writeLine(`return super.${element.methodName}(req, res);`)
			);
		}
	} else {
		const decorators = controllerClass.getDecorator("RouteMiddleware");
		if (!decorators) {
			controllerClass
				.addDecorator({
					name: "RouteMiddleware<AuthMiddlewareArgs>",
					arguments: ["AuthMiddleware", `[Roles.${element.role}]`],
				})
				.setIsDecoratorFactory(true);
		} else {
			const args = decorators.getArguments()[1] as ArrayLiteralExpression;

			for (const e of args.getElements()) {
				const tmp = e as PropertyAccessExpression;

				if (element.role === tmp.getName()) {
					throw new Error(`${element.role} already exist`);
				}
			}

			args.addElement(`Roles.${element.role}`);
		}
	}

	controllerFile.fixMissingImports();
}
