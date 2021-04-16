import project from "../utils/project";

export async function getRoutes(): Promise<any> {
	const validDecorator = ["Get", "Post", "Patch", "Delete"];

	const controllerFiles = project.getSourceFiles(
		"src/api/controllers/*.controller.ts"
	);

	const entity = [{}];

	for (const controller of controllerFiles) {
		const classes = controller.getClasses();

		for (const classe of classes) {
			const routes = [{}];
			console.log("" + classe.getName());
			const methods = classe.getMethods();

			for (const method of methods) {
				console.log("-" + method.getName());
				const decorators = method.getDecorators();

				for (const decorator of decorators) {
					if (validDecorator.includes(decorator.getName())) {
						console.log("--" + decorator.getName());
						const args = decorator.getArguments();

						for (const arg of args) {
							console.log("---" + arg.getFullText());
							routes.push({
								method: method.getName(),
								type: decorator.getName(),
								route: arg.getFullText(),
							});
						}
					}
				}
			}
			entity.push({ entity: classe.getName(), routes: routes });
		}
	}
	console.log(entity);

	return [];
}
