import type { Class, StringKeyOf } from 'type-fest';
import { CannotAccessFieldError } from '../errors/cannot-access-field.js';
import { CannotCreateResourceError } from '../errors/cannot-create-recource.js';
import { CannotDeleteResourceError } from '../errors/cannot-delete-resource.js';
import { CannotUpdateFieldError } from '../errors/cannot-update-field.js';
import { InvalidResourceFieldError } from '../errors/invalid-resource-field.js';
import { UnknownResourceFieldError } from '../errors/unknown-resource-field.js';
import type { Resource } from './resource.js';
import type { ResourceProperty, ResourceSchema } from './schema.js';

class ResourceProxyHandler<T extends object> implements ProxyHandler<Resource<T>> {
  public constructor (
    private schema: ResourceSchema<T>,
    private actor: unknown
  ) {}

  public delete (target: T) {
    if (!this.schema.authorization.authorizer.canDelete(target, this.actor)) {
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

  public get (resource: T, propertyName: string) {
    if (this.isDeleteProperty(propertyName)) {
      return () => this.delete(resource);
    }

    this.assertExistsInSchemaStructure(propertyName);

    const propertyValue: unknown = resource[propertyName as never];

    this.assertFieldAccess(resource, propertyName as StringKeyOf<T>, propertyValue);

    return propertyValue;
  }

  // eslint-disable-next-line class-methods-use-this
  private isDeleteProperty (propertyName: string) {
    return propertyName === 'delete';
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

  private assertExistsInSchemaStructure (p: string) {
    if (!Object.hasOwn(this.schema.structure, p)) {
      throw new UnknownResourceFieldError(`${p} is unknown`);
    }
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

function instantiateAndWrapResourceIntoProxy<T extends object> (ResourceClass: Class<T, any[]>, schema: ResourceSchema<T>, actor: string | undefined) {
  const resourceInstance = new ResourceClass();
  return createProxy<T>(resourceInstance, schema, actor);
}

export function createResource<T extends object> (ResourceClass: Class<T>, schema: ResourceSchema<T>, actor?: string): Resource<T> {
  assertCanCreateResource<T>(schema, actor);
  return instantiateAndWrapResourceIntoProxy<T>(ResourceClass, schema, actor);
}

export function createExistingResource<T extends object> (ResourceClass: Class<T>, schema: ResourceSchema<T>, actor?: string): Resource<T> {
  return instantiateAndWrapResourceIntoProxy<T>(ResourceClass, schema, actor);
}
