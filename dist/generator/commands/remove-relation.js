"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeRelation = void 0;
const ts_morph_1 = require("ts-morph");
const resources_1 = require("../static/resources");
const project_1 = require("../utils/project");
async function removeRelation(entity, relationName) {
    const model = resources_1.default(entity).find((r) => r.template === "model");
    const modelFile = project_1.default.getSourceFile(`${model.path}/${model.name}`);
    const naming = resources_1.getEntityNaming(entity);
    relationName =
        typeof relationName === "string" ? relationName : relationName.name;
    if (!modelFile) {
        throw new Error("Entity does not exists");
    }
    const entityClass = modelFile.getClass(naming.classPrefixName);
    if (!entityClass) {
        throw new Error("Entity class does not exists");
    }
    if (!entityClass.getProperty(relationName)) {
        throw new Error("Relation property does not exists");
    }
    const property = entityClass.getProperty(relationName);
    const relationDecorator = property
        .getDecorators()
        .find((dec) => ["ManyToOne", "ManyToMany", "OneToMany", "OneToOne"].includes(dec.getName()));
    const callExpression = relationDecorator.getCallExpression();
    const [inverseModel, inverseProp] = callExpression.getArguments();
    const propertyAccess = inverseProp.getBody();
    const inverseModelIdentifier = inverseModel.getFirstChildByKind(ts_morph_1.SyntaxKind.Identifier);
    const inverseDefinitionFile = inverseModelIdentifier
        .getDefinitions()[0]
        .getSourceFile();
    const inverseProperty = propertyAccess
        .getLastChildByKind(ts_morph_1.SyntaxKind.Identifier)
        .getText();
    const inverseClass = inverseDefinitionFile.getClass(inverseModelIdentifier.getText());
    const modelInterface = modelFile.getInterface(`${naming.classPrefixName}Interface`);
    const inverseInterface = inverseDefinitionFile.getInterface(`${inverseModelIdentifier.getText()}Interface`);
    const serializer = resources_1.default(entity).find((r) => r.template === "serializer-schema");
    const serializerFile = project_1.default.getSourceFile(`${serializer.path}/${serializer.name}`);
    const serializerClass = serializerFile.getClass(`${naming.classPrefixName}SerializerSchema`);
    const inverseSerializer = resources_1.default(inverseClass.getName().toLowerCase()).find((r) => r.template === "serializer-schema");
    const inverseSerializerFile = project_1.default.getSourceFile(`${inverseSerializer.path}/${inverseSerializer.name}`);
    const inverseSerializerClass = inverseSerializerFile.getClass(`${inverseClass.getName()}SerializerSchema`);
    property.remove();
    inverseClass.getProperty(inverseProperty)?.remove();
    modelInterface.getProperty(relationName)?.remove();
    inverseInterface.getProperty(inverseProperty)?.remove();
    serializerClass.getProperty(relationName)?.remove();
    inverseSerializerClass.getProperty(inverseProperty)?.remove();
}
exports.removeRelation = removeRelation;
//# sourceMappingURL=remove-relation.js.map