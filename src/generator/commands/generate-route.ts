import { ObjectLiteralExpression, SyntaxKind } from "ts-morph";
import { httpRequestMethods } from "../../..";
import { resources, getEntityNaming } from "../static/resources";
import project from "../utils/project";
import { addEndpoint } from "./add-endpoint";
import { getRoutes } from "./get-routes";

/**
 * Generates a basic route.
 * @param prefix Prefix of the route.
 * @param methods Methods used in the route.
 * @returns A promise.
 */
export async function generateBasicRoute(
	prefix: string,
	methods?: Array<string>
): Promise<void> {
	prefix = prefix.toLowerCase();

	for (const route of (await getRoutes())) {
		if (prefix === route.prefix.toLowerCase()) {
			throw new Error("This route already exists.");
		}
	}

	methods = methods ?? ["GET"];
	methods = methods.map((m) => m.toUpperCase());

	if (methods.find((v) => !httpRequestMethods.includes(v)))
			throw new Error(`One of the methods is not valid, methods must be in these values: ${httpRequestMethods}`);

	const { filePrefixName, classPrefixName } = getEntityNaming(prefix);

	const file = resources(filePrefixName).find(
		(f) => f.template === "base-controller"
	);
	const imported = await import(`../templates/${file.template}`);
	const generator = imported[Object.keys(imported)[0]];
	const createdFile = await generator({
		prefix,
		classPrefixName,
		filePrefixName,
		fileTemplateInfo: file,
	});

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

	if (!exists) {
		controllersArray.addElement(importControllerName);
	}

	for (const method of methods) {
		await addEndpoint(prefix, method);
	}

	// auto generate imports
	for (const file of [].concat(applicationFile, createdFile)) {
		file.fixMissingImports();
	}
}
