import { GeneratorParameters } from "../interfaces/generator.interface";
import project from "../utils/project";

/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
export function createBaseControllerTemplate({
    fileTemplateInfo,
    classPrefixName,
    filePrefixName
}: GeneratorParameters) {
    const file = project.createSourceFile(
        `${fileTemplateInfo.path}/${fileTemplateInfo.name}`,
        null,
        {
            overwrite: true
        }
    );

    const controllerClass = file.addClass({
        name: `${classPrefixName}Controller`
    });

    controllerClass.setIsExported(true);

    controllerClass
        .addDecorator({
            name: "GeneratedController",
            arguments: [`"${classPrefixName.toLowerCase()}"`]
        })
        .setIsDecoratorFactory(true);
    controllerClass
        .addDecorator({
            name: "singleton"
        })
        .setIsDecoratorFactory(true);
    controllerClass
        .addDecorator({
            name: "autoInjectable"
        })
        .setIsDecoratorFactory(true);

    controllerClass.setExtends(`BaseController`);

    return file;
}
