import project from "../utils/project";
import { resources } from "../static/resources";

export default async function getRoles(): Promise<Array<String>> {
	const controller = resources("role").find((r) => r.template === "roles");

	const controllerFile = project.getSourceFile(
		`${controller.path}/${controller.name}`
	);

	if (!controllerFile) {
		throw new Error("This controller does not exist.");
	}

	const enumDeclaration = controllerFile.getEnum("Roles");

	if (!enumDeclaration) {
		throw new Error("This enums does not exit");
	}

	const members = enumDeclaration.getMembers();

	const array = [];
	for (const member of members) {
		array.push(member.getName());
	}

	return array;
}
