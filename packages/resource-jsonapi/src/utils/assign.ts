// export function assign<T extends Resource>(resource: T, payload: Partial<ResourcePojo<T>>, registry: SchemaRegistries): void {
//     const rootSchema = registry.getSchemaFor(resource.type);
// 
//     for (const [key, value] of Object.entries(payload)) {
//         if (rootSchema.attributes[key] || key === "id") {
//             resource[key] = value;
//             continue;
//         }
// 
//         const relationshipDescriptor = rootSchema.relationships[key] as SchemaRelationship | undefined;
//         if (relationshipDescriptor) {
//             const relationshipSchema = registry.getSchemaFor(relationshipDescriptor.type);
// 
//             if (resource[key] === undefined) {
//                 resource[key] = new relationshipSchema.class();
//             }
// 
//             if (relationshipDescriptor.cardinality === 'has-many') {
//                 resource[key] = (value as string[]).map((k) => {
//                     const instance = new relationshipSchema.class();
//                     instance.id = k;
//                     return instance;
//                 })
//             } else {
//                 resource[key] = new relationshipSchema.class();
//                 resource[key].id = value;
//             }
// 
//             continue;
//         }
// 
//         throw new UnknownFieldInSchemaError(`${key} does not exists in schema`, key);
//     }
// }
