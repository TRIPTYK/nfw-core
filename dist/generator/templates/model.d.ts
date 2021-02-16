import { SourceFile } from "ts-morph";
import { GeneratorParameters } from "../interfaces/generator.interface";
/**
 *
 * @param path
 * @param className
 * @param {array} entities
 * @return {SourceFile}
 */
export declare function createModelTemplate({ fileTemplateInfo, classPrefixName, modelName, filePrefixName, }: GeneratorParameters): SourceFile;
