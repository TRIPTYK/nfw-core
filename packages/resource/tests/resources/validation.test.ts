import { beforeEach, vitest, expect, describe, it, test } from 'vitest';

import { createResource, UnknownResourceFieldError, InvalidResourceFieldError } from '../../src/index.js';
import type { ResourceAuthorizer } from '../../src/resources/authorizer.js';
import type { ResourceSchema } from '../../src/resources/schema.js';
import { ArticleResource, structure } from './drivers/article.js';

let resource: ArticleResource;

const validAuthorizer = {
  authorizer: {
    canAccessField: () => true,
    canCreateResource: () => true
  } as ResourceAuthorizer
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
