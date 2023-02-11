import { beforeEach, expect, test, vitest, describe, it } from 'vitest';
import { InvalidResourceFieldError } from '../src/errors/invalid-resource-field.js';
import { UnauthorizedError } from '../src/errors/unauthorized-error.js';
import { UnknownResourceFieldError } from '../src/errors/unknown-resource-field.js';
import type { ResourceSchema } from '../src/create-resource.js';
import { createResource } from '../src/create-resource.js';

class ArticleResource {
  public firstName?: string;
}

let resource: ArticleResource;

const structure = {
  firstName: {
    type: 'string'
  }
};

const validAuthorizer = {
  authorizer: {
    canAccessField: () => true
  }
};

describe('resource validation', () => {
  describe('valid resource', () => {
    let schema: ResourceSchema<ArticleResource>;

    beforeEach(() => {
      schema = {
        structure,
        validator: {
          isFieldValid: vitest.fn(() => true)
        },
        authorization: validAuthorizer
      };
      resource = createResource(ArticleResource, schema);
    });

    it('should call validator before setting property', () => {
      resource.firstName = '1234';
      expect(schema.validator.isFieldValid).toBeCalledWith('firstName', '1234', 'string');
    });

    test('resource should refuse unknown fields', () => {
      expect(() => (resource as any).prout = '123').toThrowError(UnknownResourceFieldError);
    });

    test('resource should accept valid fields', () => {
      resource.firstName = '123';
      expect(resource.firstName).toStrictEqual('123');
    });
  });

  describe('Invalid resource', () => {
    beforeEach(() => {
      resource = createResource(ArticleResource, {
        structure,
        validator: {
          isFieldValid: vitest.fn(() => false)
        },
        authorization: validAuthorizer
      });
    });

    it('should refuse property if validator returns false for this property', () => {
      expect(() => (resource as any).firstName = 1234).toThrowError(InvalidResourceFieldError);
    });
  });
});

describe('Resource authorization', () => {
  let schema: ResourceSchema<ArticleResource>;

  beforeEach(() => {
    schema = {
      structure,
      validator: {
        isFieldValid: () => true
      },
      authorization: {
        authorizer: {
          canAccessField: () => false
        }
      }
    };
    resource = createResource(ArticleResource, schema);
  });

  it('Should refuse actor when not allowed to access resource field', () => {
    expect(() => resource.firstName).toThrowError(UnauthorizedError);
  });

  it('Should throw Error when actor is not allowed to access resource field', () => {
    expect(() => resource.firstName).toThrowError(UnauthorizedError);
  });
});
