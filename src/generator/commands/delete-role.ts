import * as pascalcase from "pascalcase";
import {
	ArrayLiteralExpression,
	Decorator,
	PropertyAccessExpression,
} from "ts-morph";
import project from "../utils/project";
import { resources } from "../static/resources";
import { getRoles } from "./get-roles";

export async function deleteRole(roleName: string): Promise<void> {

	if(!(await getRoles()).find(v => v===roleName))
		throw new Error(`Role "${roleName}" does not exist.`);
		
	const controller = resources("role").find((r) => r.template === "roles");

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const enumDeclaration = controllerFile.getEnum("Roles");

	const tmp = enumDeclaration.getMember(pascalcase(roleName));
	for (const referencedSymbol of tmp.findReferences()) {
		for (const reference of referencedSymbol.getReferences()) {
			if (reference.getSourceFile().getFilePath().match("controller")) {
				const args = reference
					.getNode()
					.getParentOrThrow()
					.getParentOrThrow() as ArrayLiteralExpression;
				for (const e of args.getElements()) {
					const tmp = e as PropertyAccessExpression;
					if (tmp.getName() === roleName) {
						args.removeElement(e);
					}
				}

				const decorator = args
					.getParentOrThrow()
					.getParentOrThrow() as Decorator;

				if (decorator.getArguments()[1].getText() === "[]") {
					decorator.remove();
				}
			}
		}
	}
	if (tmp) {
		const member = tmp.remove();
	}
}
