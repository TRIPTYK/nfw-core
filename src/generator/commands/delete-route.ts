import { ObjectLiteralExpression, SyntaxKind } from "ts-morph";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import { getRoutes } from "./get-routes";

export async function deleteBasicRoute(prefix: string): Promise<void> {
	if (!prefix.length) {
		return;
	}

	const currentRoute = (await getRoutes()).find(
		route => route.prefix === prefix
	);

	if(!currentRoute)
		throw new Error(`Prefix "${prefix}" doesn't exist.`)

	if (currentRoute.type !== "generated")
		throw new Error(`Only generated routes can be deleted (type: ${currentRoute.type}).`);

	const { filePrefixName, classPrefixName } = getEntityNaming(prefix);

	const file = resources(filePrefixName).find(
		f => f.template === "base-controller"
	);

	const fileObj = project.getSourceFile(`${file.path}/${file.name}`);
	if (!fileObj)
		throw new Error(`Entity file ${file.name} does not seems to exists`);
	
	fileObj?.delete();

	const applicationFile = project.getSourceFile("src/api/application.ts");

	const applicationClass = applicationFile.getClasses()[0];
	const importControllerName = `${classPrefixName}Controller`;

	const objectArgs = applicationClass
		.getDecorator("RegisterApplication")
		.getArguments()[0] as ObjectLiteralExpression;
	const controllersArray = objectArgs
		.getProperty("controllers")
		.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
	const exists = controllersArray
		.getElements()
		.find((elem) => elem.getText() === importControllerName);

	controllersArray.removeElement(exists);

	applicationFile.fixUnusedIdentifiers();
}
