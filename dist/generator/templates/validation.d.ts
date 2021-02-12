import { GeneratorParameters } from "../interfaces/generator.interface";
import TsMorph = require("ts-morph");
export declare function createValidationTemplate({ fileTemplateInfo, classPrefixName, filePrefixName, }: GeneratorParameters): TsMorph.SourceFile;
