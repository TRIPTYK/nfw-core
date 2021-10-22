import * as camelcase from "camelcase";
import * as pascalcase from "pascalcase";
import stringifyObject from "stringify-object";
import {
  ObjectLiteralExpression,
  PropertyAssignment,
  SyntaxKind,
  VariableDeclarationKind,
} from "ts-morph";
import { EntityColumn } from "../interfaces/generator.interface";
import { resources, getEntityNaming } from "../static/resources";
import { createEnumsTemplate } from "../templates/enums";
import project from "../utils/project";
import {
  buildModelColumnArgumentsFromObject,
  buildValidationArgumentsFromObject,
} from "../utils/template";
import { arrayOfNumber, arrayOfString, arrayOfDate } from "../../enums/types";

export async function addColumn(
  entity: string,
  column: EntityColumn
): Promise<void> {
  const model = resources(entity).find((r) => r.template === "model");
  const modelFile = project.getSourceFile(`${model.path}/${model.name}`);
  const { classPrefixName } = getEntityNaming(entity);

  if (!modelFile) {
    throw new Error("Entity does not exists");
  }

  const entityClass = modelFile.getClass(classPrefixName);

  if (!entityClass) {
    throw new Error("Entity class does not exists");
  }

  if (entityClass.getInstanceProperty(column.name)) {
    throw new Error("Class property already exists");
  }

  const entityInterface = modelFile.getInterface(`${classPrefixName}Interface`);
  if (entityInterface) {
    if (column.type === "enum") {
      entityInterface.addProperty({
        name: column.name,
        type: pascalcase(column.name),
      });
    } else if (column.type === "set") {
      entityInterface.addProperty({
        name: column.name,
        type: `${pascalcase(column.name)}[]`,
      });
    } else if (arrayOfNumber.includes(column.type)) {
      entityInterface.addProperty({
        name: column.name,
        type: "number",
      });
    } else if (arrayOfString.includes(column.type)) {
      entityInterface.addProperty({ name: column.name, type: "string" });
    } else if (arrayOfDate.includes(column.type)) {
      entityInterface.addProperty({ name: column.name, type: "Date" });
    } else {
      entityInterface.addProperty({ name: column.name });
    }
  }

  entityClass
    .addProperty({ name: column.name })
    .toggleModifier("public")
    .addDecorator({
      name: "Column",
      arguments: stringifyObject(buildModelColumnArgumentsFromObject(column), {
        transform: (tmp, prop, originalResult) => {
          if (prop === "default" && tmp.type === "json") {
            return `() => \`('${JSON.stringify(tmp.default)}')\``;
          }
          if (prop === "default" && tmp.type === "enum") {
            const val = `${tmp.enum}.${pascalcase(tmp.default)}`;
            return val;
          }
          if (prop === "default" && tmp.type === "set") {
            let array = [];
            for (const value of tmp.default) {
              array.push(`${tmp.enum}.${pascalcase(value)}`);
            }
            return `[${array}]`;
          }
          if (prop === "enum") {
            return originalResult.split("'").join("");
          }
          return originalResult;
        },
        singleQuote: false,
      }),
    })
    .setIsDecoratorFactory(true);

  if (column.type === "enum") {
    entityClass.getProperty(column.name).setType(pascalcase(column.name));
  } else if (column.type === "set") {
    entityClass
      .getProperty(column.name)
      .setType(`${pascalcase(column.name)}[]`);
  } else if (arrayOfNumber.includes(column.type)) {
    entityClass.getProperty(column.name).setType("number");
  } else if (arrayOfString.includes(column.type)) {
    entityClass.getProperty(column.name).setType("string");
  } else if (arrayOfDate.includes(column.type)) {
    entityClass.getProperty(column.name).setType("Date");
  }

  if (column.enums) {
    const importDeclaration = modelFile.addImportDeclaration({
      moduleSpecifier: `../enums/${camelcase(column.name)}.enum`,
      namedImports: pascalcase(column.name),
    });
    createEnumsTemplate(column.name, column.enums);
  }

  const serializer = resources(entity).find(
    (r) => r.template === "serializer-schema"
  );
  const serializerFile = project.getSourceFile(
    `${serializer.path}/${serializer.name}`
  );
  const serializerClass = serializerFile.getClass(
    `${classPrefixName}SerializerSchema`
  );

  const serializeProperty = serializerClass
    .addProperty({
      name: column.name,
    })
    .toggleModifier("public");

  serializeProperty
    .addDecorator({
      name: "Serialize",
    })
    .setIsDecoratorFactory(true);

  serializeProperty
    .addDecorator({
      name: "Deserialize",
    })
    .setIsDecoratorFactory(true);

  const validation = resources(entity).find((r) => r.template === "validation");
  const validationFile = project.getSourceFile(
    `${validation.path}/${validation.name}`
  );

  const validations = validationFile
    .getChildrenOfKind(SyntaxKind.VariableStatement)
    .filter(
      (declaration) =>
        declaration.hasExportKeyword() &&
        declaration.getDeclarationKind() === VariableDeclarationKind.Const
    )
    .filter((declaration) =>
      ["create", "update"].includes(declaration.getDeclarations()[0].getName())
    );

  for (const validationStatement of validations) {
    const initializer = validationStatement
      .getDeclarations()[0]
      .getInitializer() as ObjectLiteralExpression;

    if (column.type === "set") {
      const property = initializer.addPropertyAssignment({
        name: column.name,
        initializer: "",
      }) as PropertyAssignment;

      property.setInitializer((writer) =>
        writer.block(() => {
          writer.writeLine("exists: true,");
          writer.writeLine("custom: ").block(() => {
            writer.writeLine("options: (values) =>").block(() => {
              writer.writeLine("for (const value of values)").block(() => {
                writer
                  .writeLine(
                    `if (!Object.values(${pascalcase(
                      column.name
                    )}).includes(value))`
                  )
                  .block(() => {
                    writer.writeLine("return false;");
                  });
              });
              writer.writeLine("return true;");
            });
          });
        })
      );
    } else {
      initializer.addPropertyAssignment({
        name: column.name,
        initializer: stringifyObject(
          buildValidationArgumentsFromObject(column),
          {
            transform: (tmp, prop, originalResult) => {
              if (prop === "options") {
                return originalResult.split('"').join("");
              }
              return originalResult;
            },
            singleQuotes: false,
          }
        ),
      });
    }
  }

  modelFile.fixMissingImports();
  validationFile.fixMissingImports();
}
