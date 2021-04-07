import { 
  ModuleKind, 
  Project, 
  ScriptTarget, 
  ProjectOptions 
} from "ts-morph";
import { singleton } from "tsyringe";

@singleton()
class CoreProject extends Project{

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

  constructor(config?: ProjectOptions) {
    super(config ?? {
      tsConfigFilePath: "tsconfig.json",
    });
    this.addSourceFilesAtPaths(["src/**/*.ts", "test/**/*.ts"]);
  }

  public static get Instance() {
    if(!this.instance) {
      try {
        this.instance = new CoreProject();
      } catch (error) {
        this.instance = new CoreProject(this.defaultConfig);
      }
    }
      
    return this.instance;
  }
}

/**
 * @return Project
 * @description Singleton like method
 */
export default CoreProject.Instance;