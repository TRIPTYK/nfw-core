"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CoreProject_1;
Object.defineProperty(exports, "__esModule", { value: true });
const ts_morph_1 = require("ts-morph");
const tsyringe_1 = require("tsyringe");
let CoreProject = CoreProject_1 = class CoreProject extends ts_morph_1.Project {
    constructor(config) {
        super(config ?? {
            tsConfigFilePath: "tsconfig.json",
        });
        this.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
    }
    static get Instance() {
        if (!this.instance) {
            try {
                this.instance = new CoreProject_1();
            }
            catch (error) {
                this.instance = new CoreProject_1(this.defaultConfig);
            }
        }
        return this.instance;
    }
};
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
CoreProject = CoreProject_1 = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [Object])
], CoreProject);
/**
 * @return Project
 * @description Singleton like method
 */
exports.default = CoreProject.Instance;
