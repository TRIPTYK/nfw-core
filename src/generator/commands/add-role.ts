import camelcase from "camelcase";
import * as pascalcase from "pascalcase";
import project from "../utils/project";
import { resources } from "../static/resources";

export async function addRole(roleName: string): Promise<void> {
	const controller = resources("role").find((r) => r.template === "roles");

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const enumDeclaration = controllerFile.getEnum("Roles");

	const tmp = enumDeclaration.getMember(pascalcase(roleName));

	if (!tmp) {
		const member = enumDeclaration.addMember({
			name: pascalcase(roleName),
			value: camelcase(roleName),
		});
	} else {
		throw new Error(`${roleName} already exist`);
	}
}
