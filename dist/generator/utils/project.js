"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsMorph = require("ts-morph");
let isInitialised = false;
const project = new tsMorph.Project({
    tsConfigFilePath: "tsconfig.json"
});
/**
 * @return Project
 * @description Singleton like method
 */
exports.default = (() => {
    if (!isInitialised) {
        project.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
        isInitialised = true;
    }
    return project;
})();
//# sourceMappingURL=project.js.map