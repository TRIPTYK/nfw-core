import { beforeEach, expect, describe, it } from 'vitest';
import { UnauthorizedError } from '../../src/index.js';
import type { StructureLessArticleSchema, ArticleResource } from './fake/article.js';
import { createArticleResource } from './fake/article.js';

let resource: ArticleResource;

describe('resource authorization', () => {
  let schema: StructureLessArticleSchema;

  describe('resource creation', () => {
    it('refuses creating a new resource when not allowed', () => {
      expect(() => createArticleResource({
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canAccessField: () => true,
            canCreateResource: () => false
          }
        }
      })).toThrowError(UnauthorizedError);
    });
  });

  describe('field access', () => {
    beforeEach(() => {
      schema = {
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canAccessField: () => false,
            canCreateResource: () => true
          }
        }
      };
      resource = createArticleResource(schema);
    });

    it('Should refuse actor when not allowed to access resource field', () => {
      expect(() => resource.firstName).toThrowError(UnauthorizedError);
    });
  });
});
