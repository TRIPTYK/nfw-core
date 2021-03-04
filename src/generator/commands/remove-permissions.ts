import { ArrayLiteralExpression, PropertyAccessExpression } from "ts-morph";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";

export default async function removePerms(element: any): Promise<void> {
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

			const args = decorators.getArguments()[1] as ArrayLiteralExpression;
			for (const e of args.getElements()) {
				const tmp = e as PropertyAccessExpression;
				if (tmp.getName() === element.role) {
					args.removeElement(e);
				}
			}

			if (decorators.getArguments()[1].getText() === "[]") {
				decorators.remove();
			}
		}
	} else {
		const decorators = controllerClass.getDecorator("RouteMiddleware");

		const args = decorators.getArguments()[1] as ArrayLiteralExpression;
		for (const e of args.getElements()) {
			const tmp = e as PropertyAccessExpression;
			if (tmp.getName() === element.role) {
				args.removeElement(e);
			}
		}

		if (decorators.getArguments()[1].getText() === "[]") {
			decorators.remove();
		}
	}
	controllerFile.fixUnusedIdentifiers();
}
