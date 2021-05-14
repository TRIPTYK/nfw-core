import { GeneratorParameters } from "../interfaces/generator.interface";
/**
 *
 * @param path
 * @param className
 * @param options
 * @param classPrefixName
 */
export declare function createControllerTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): import("ts-morph").SourceFile;
