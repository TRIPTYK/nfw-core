import { beforeEach, expect, describe, it } from 'vitest';
import { UnauthorizedError } from '../../src/index.js';
import { createResource } from '../../src/resources/create-resource.js';
import type { ResourceSchema } from '../../src/resources/schema.js';
import { ArticleResource, structure } from './drivers/article.js';

let resource: ArticleResource;

describe('resource authorization', () => {
  let schema: ResourceSchema<ArticleResource>;

  describe('resource creation', () => {
    it('refuses creating a new resource when not allowed', () => {
      expect(() => createResource(ArticleResource, {
        structure,
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
        structure,
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
      resource = createResource(ArticleResource, schema);
    });

    it('Should refuse actor when not allowed to access resource field', () => {
      expect(() => resource.firstName).toThrowError(UnauthorizedError);
    });
  });
});
