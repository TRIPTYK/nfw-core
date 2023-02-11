import type { Class, StringKeyOf } from 'type-fest';
import { InvalidResourceFieldError } from './errors/invalid-resource-field.js';
import { UnauthorizedError } from './errors/unauthorized-error.js';
import { UnknownResourceFieldError } from './errors/unknown-resource-field.js';

type ResourceStructure<T extends object> = {
    [key in StringKeyOf<T>]: ResourceProperty
}

interface ResourceProperty {
    type: string,
}

interface ResourceAuthorizer {
  canAccessField: (field: string, value: unknown, actor: unknown) => boolean,
}

export interface ResourceSchema<T extends object> {
    validator: ResourceValidator,
    structure: ResourceStructure<T>,
    authorization: {
      authorizer: ResourceAuthorizer,
    },
}

export interface ResourceValidator {
    isFieldValid(key: string, newValue: unknown, validator: string): boolean,
}

class ResourceProxyHandler<T extends object> implements ProxyHandler<T> {
  public constructor (
    private schema: ResourceSchema<T>,
    private actor: unknown
  ) {}

  public set (target: T, propertyName: string, newValue: unknown) {
    this.assertExistsInStructure(propertyName);

    const schemaStructureProperty = this.schema.structure[propertyName as StringKeyOf<T>];

    this.validateNewValue(propertyName, newValue, schemaStructureProperty);

    Object.defineProperty(target, propertyName, {
      value: newValue
    });

    return true;
  }

  public get (target: T, propertyName: string) {
    this.assertExistsInStructure(propertyName);

    const propertyValue: unknown = target[propertyName as never];

    this.assertFieldAccess(propertyName, propertyValue);

    return propertyValue;
  }

  private assertFieldAccess (propertyName: string, propertyValue: unknown) {
    if (!this.schema.authorization.authorizer.canAccessField(propertyName, propertyValue, this.actor)) {
      throw new UnauthorizedError();
    }
  }

  private validateNewValue (p: string, newValue: unknown, validationType: ResourceProperty) {
    const validator = this.schema.validator;
    if (!validator.isFieldValid(p, newValue, validationType.type)) {
      throw new InvalidResourceFieldError();
    }
  }

  private assertExistsInStructure (p: string) {
    if (!Object.hasOwn(this.schema.structure, p)) {
      throw new UnknownResourceFieldError(`${p} is unknown`);
    }
  }
}

function createProxy<T extends object> (resourceInstance: T, schema: ResourceSchema<T>, actor?: unknown): T {
  return new Proxy<T>(resourceInstance, new ResourceProxyHandler(schema, actor));
}

export function createResource<T extends object> (ResourceClass: Class<T>, schema: ResourceSchema<T>, actor?: string): T {
  const resourceInstance = new ResourceClass();
  return createProxy<T>(resourceInstance, schema, actor);
}
