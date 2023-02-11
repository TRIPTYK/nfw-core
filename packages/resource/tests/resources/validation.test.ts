import { beforeEach, vitest, expect, describe, it, test } from 'vitest';

import { UnknownResourceFieldError, InvalidResourceFieldError } from '../../src/index.js';
import type { ResourceAuthorizer } from '../../src/resources/authorizer.js';
import type { StructureLessArticleSchema, ArticleResource } from './fake/article.js';
import { createArticleResource } from './fake/article.js';

let resource: ArticleResource;

const validAuthorizer = {
  authorizer: {
    canAccessField: () => true,
    canCreateResource: () => true
  } as ResourceAuthorizer
};

describe('resource validation', () => {
  describe('valid resource', () => {
    let schema: StructureLessArticleSchema;

    beforeEach(() => {
      schema = {
        validator: {
          isFieldValid: vitest.fn(() => true)
        },
        authorization: validAuthorizer
      };
      resource = createArticleResource(schema);
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
      resource = createArticleResource({
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
