import { Project, ProjectOptions } from "ts-morph";
declare class CoreProject extends Project {
    private static instance;
    private static defaultConfig;
    constructor(config?: ProjectOptions);
    static get Instance(): CoreProject;
}
declare const _default: CoreProject;
/**
 * @return Project
 * @description Singleton like method
 */
export default _default;
