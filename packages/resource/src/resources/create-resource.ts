import type { StringKeyOf } from 'type-fest';
import { CannotAccessFieldError } from '../errors/cannot-access-field.js';
import { CannotCreateResourceError } from '../errors/cannot-create-recource.js';
import { CannotDeleteResourceError } from '../errors/cannot-delete-resource.js';
import { CannotUpdateFieldError } from '../errors/cannot-update-field.js';
import { InvalidResourceFieldError } from '../errors/invalid-resource-field.js';
import { UnknownResourceFieldError } from '../errors/unknown-resource-field.js';
import type { Resource } from './resource.js';
import type { ResourceProperty, ResourceSchema } from './schema.js';

const SPECIAL_OBJECT_PROPERTIES = ['hasOwnProperty', 'then', 'toJSON'] as const;
const SPECIAL_RESOURCE_OBJECT_PROPERTIES = ['delete'] as const;

class ResourceProxyHandler<T extends object> implements ProxyHandler<Resource<T>> {
  public constructor (
    private schema: ResourceSchema<T>,
    private actor: unknown
  ) {}

  public delete (resource: T) {
    if (!this.schema.authorization.authorizer.canDelete(resource, this.actor)) {
      throw new CannotDeleteResourceError();
    }
  }

  public set (resource: T, propertyName: string, newValue: unknown) {
    this.assertExistsInSchemaStructure(propertyName);

    const schemaStructureProperty = this.schema.structure[propertyName as StringKeyOf<T>];

    this.assertCanUpdateField(resource, propertyName, newValue);

    this.validateNewValue(propertyName, newValue, schemaStructureProperty);

    Object.defineProperty(resource, propertyName, {
      value: newValue
    });

    return true;
  }

  public get (resource: T, propertyName: string): unknown {
    if (this.isSpecialObjectProperty(propertyName)) {
      return this.proxyToObject(resource, propertyName);
    }

    if (this.isSpecialResourceProperty(propertyName)) {
      return this.getSpecialResourceProperty(resource, propertyName);
    }

    return this.getSchemaPropertyInResource(propertyName, resource);
  }

  private getSchemaPropertyInResource (propertyName: string, resource: T) {
    this.assertExistsInSchemaStructure(propertyName);

    const propertyValue: unknown = resource[propertyName as never];

    this.assertFieldAccess(resource, propertyName as StringKeyOf<T>, propertyValue);

    return propertyValue;
  }

  // eslint-disable-next-line class-methods-use-this
  private isSpecialObjectProperty (propertyName: string) {
    return SPECIAL_OBJECT_PROPERTIES.includes(propertyName as never);
  }

  // eslint-disable-next-line class-methods-use-this
  private isSpecialResourceProperty (propertyName: string) {
    return SPECIAL_RESOURCE_OBJECT_PROPERTIES.includes(propertyName as never);
  }

  // eslint-disable-next-line class-methods-use-this
  private proxyToObject (resource: T, propertyName: string) {
    return resource[propertyName as never];
  }

  private getSpecialResourceProperty (resource: T, propertyName: string) {
    if (propertyName === 'delete') {
      return () => this.delete(resource);
    }
  }

  private assertCanUpdateField (resource: T, propertyName: string, newValue: unknown) {
    if (!this.schema.authorization.authorizer.canUpdateField(resource, propertyName as StringKeyOf<T>, newValue)) {
      throw new CannotUpdateFieldError();
    }
  }

  private assertFieldAccess (resource: T, propertyName: StringKeyOf<T>, propertyValue: unknown) {
    if (!this.schema.authorization.authorizer.canAccessField(resource, propertyName, propertyValue, this.actor)) {
      throw new CannotAccessFieldError();
    }
  }

  private validateNewValue (p: string, newValue: unknown, validationType: ResourceProperty) {
    const validator = this.schema.validator;
    if (!validator.isFieldValid(p, newValue, validationType.type)) {
      throw new InvalidResourceFieldError();
    }
  }

  private assertExistsInSchemaStructure (propertyName: string) {
    if (!this.doesPropertyExistsInSchemaStructure(propertyName)) {
      throw new UnknownResourceFieldError(`${propertyName} is unknown`);
    }
  }

  private doesPropertyExistsInSchemaStructure (propertyName: string) {
    return Object.hasOwn(this.schema.structure, propertyName);
  }
}

function createProxy<T extends object> (resourceInstance: T, schema: ResourceSchema<T>, actor?: unknown): Resource<T> {
  const handler = new ResourceProxyHandler(schema, actor);
  return new Proxy<T>(resourceInstance, handler) as Resource<T>;
}

function assertCanCreateResource<T extends object> (schema: ResourceSchema<T>, actor: string | undefined) {
  if (!schema.authorization.authorizer.canCreate(actor)) {
    throw new CannotCreateResourceError();
  }
}

function instantiateAndWrapResourceIntoProxy<T extends object> (resourceInstance: T, schema: ResourceSchema<T>, actor: string | undefined) {
  return createProxy<T>(resourceInstance, schema, actor);
}

export function createResource<T extends object> (resourceInstance: T, schema: ResourceSchema<T>, actor?: string): Resource<T> {
  assertCanCreateResource<T>(schema, actor);
  return instantiateAndWrapResourceIntoProxy<T>(resourceInstance, schema, actor);
}

export function createExistingResource<T extends object> (resourceInstance: T, schema: ResourceSchema<T>, actor?: string): Resource<T> {
  return instantiateAndWrapResourceIntoProxy<T>(resourceInstance, schema, actor);
}
