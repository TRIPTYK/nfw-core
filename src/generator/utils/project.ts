import { 
  ModuleKind, 
  Project, 
  ScriptTarget, 
  ProjectOptions 
} from "ts-morph";

class CoreProject {

  private static instance: Project = null;

  private static defaultConfig: ProjectOptions = {
    compilerOptions: {
      "lib": ["es2020"],
      "target": ScriptTarget.ESNext,
      "module": ModuleKind.CommonJS,
      "allowSyntheticDefaultImports": true,
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
      "declaration": true,
      "outDir": "./dist",
      "forceConsistentCasingInFileNames": true
    }
  }

  private static config: ProjectOptions = {
    tsConfigFilePath: "tsconfig.json",
  };

  public static get Instance() {
    if(!this.instance) {
      try {
        this.instance = new Project(this.config);
      } catch (error) {
        this.instance = new Project(this.defaultConfig);
      }
      this.instance.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
    }
    return this.instance;
  }
}

/**
 * @return Project
 * @description Singleton like method
 */
export default CoreProject.Instance;