"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
class CoreProject {
    static get Instance() {
        if (!this.instance) {
            try {
                this.instance = new ts_morph_1.Project(this.config);
            }
            catch (error) {
                this.instance = new ts_morph_1.Project(this.defaultConfig);
            }
            this.instance.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
        }
        return this.instance;
    }
}
CoreProject.instance = null;
CoreProject.defaultConfig = {
    compilerOptions: {
        "lib": ["es2020"],
        "target": ts_morph_1.ScriptTarget.ESNext,
        "module": ts_morph_1.ModuleKind.CommonJS,
        "allowSyntheticDefaultImports": true,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "declaration": true,
        "outDir": "./dist",
        "forceConsistentCasingInFileNames": true
    }
};
CoreProject.config = {
    tsConfigFilePath: "tsconfig.json",
};
/**
 * @return Project
 * @description Singleton like method
 */
exports.default = CoreProject.Instance;
