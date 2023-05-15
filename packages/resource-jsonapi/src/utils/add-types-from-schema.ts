import type { Class } from 'type-fest';
import type { Resource } from '../interfaces/resource.js';
import type { SchemaRegistries } from '../types/partial-registries.js';

export type DiscriminatorMap = Map<Class<unknown>, string>;
type ResourceWithoutType<T extends Resource> = Omit<T, 'type'>;

function getSchemaTypeOrRejectIfUnknown<T extends Resource> (resource: ResourceWithoutType<T>, discriminatorMap: DiscriminatorMap, registry: SchemaRegistries) {
  const type = discriminatorMap.get(resource.constructor as Class<unknown>);
  if (!type) {
    throw new Error(`No type found for ${resource.constructor.name}`);
  }
  return registry.getSchemaFor(type);
}

export function addResourceTypes<T extends Resource> (resources: ResourceWithoutType<T> | ResourceWithoutType<T>[], discriminatorMap: DiscriminatorMap, registry: SchemaRegistries): T | T[] {
  for (const resource of Array.isArray(resources) ? resources : [resources]) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    addResourceType(resource, discriminatorMap, registry);
  }
  return resources as T | T[];
}

function addResourceType<T extends Resource> (resource: ResourceWithoutType<T>, discriminatorMap: DiscriminatorMap, registry: SchemaRegistries) {
  const schema = getSchemaTypeOrRejectIfUnknown(resource, discriminatorMap, registry);
  (resource as any).type = schema.type;
  for (const name of Object.keys(schema.relationships)) {
    if (resource[name] !== undefined) {
      addResourceTypes(resource[name] as T[], discriminatorMap, registry);
    }
  }
}
