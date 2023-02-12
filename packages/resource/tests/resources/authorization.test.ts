import { beforeEach, expect, describe, it, vi } from 'vitest';
import { CannotAccessFieldError } from '../../src/errors/cannot-access-field.js';
import { CannotCreateResourceError } from '../../src/errors/cannot-create-recource.js';
import { CannotDeleteResourceError } from '../../src/errors/cannot-delete-resource.js';
import { CannotUpdateFieldError } from '../../src/errors/cannot-update-field.js';
import type { StructureLessArticleSchema } from './fake/article.js';
import { ArticleResource, createExistingArticleResource, createArticleResource } from './fake/article.js';

let resource: ArticleResource;

describe('resource authorization', () => {
  let schema: StructureLessArticleSchema;

  describe('resource creation', () => {
    beforeEach(() => {
      schema = {
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canUpdateField: () => true,
            canDelete: () => true,
            canAccessField: () => true,
            canCreate: vi.fn(() => false)
          }
        }
      };
    });

    it('refuses creating a new resource when not allowed', () => {
      expect(() => createArticleResource(schema)).toThrowError(CannotCreateResourceError);
    });

    it('ignores canCreate when using createExistingResource', () => {
      createExistingArticleResource({
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canUpdateField: () => true,
            canDelete: () => true,
            canAccessField: () => true,
            canCreate: () => false
          }
        }
      });
      expect(schema.authorization.authorizer.canCreate).not.toBeCalled();
    });
  });

  describe('resource deletion', () => {
    beforeEach(() => {
      schema = {
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canUpdateField: () => true,
            canDelete: vi.fn(() => false),
            canAccessField: () => false,
            canCreate: () => true
          }
        }
      };
    });

    it('refuses deleting a resource when not allowed', () => {
      const resource = createExistingArticleResource(schema);

      expect(() => resource.delete()).toThrowError(CannotDeleteResourceError);

      const firstCall = (schema.authorization.authorizer.canDelete as any).calls[0];
      expect(firstCall[0]).toBeInstanceOf(ArticleResource);
      expect(firstCall[1]).toBeUndefined();
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
            canUpdateField: () => true,
            canDelete: () => true,
            canAccessField: () => false,
            canCreate: () => true
          }
        }
      };
      resource = createArticleResource(schema);
    });

    it('Should refuse actor when not allowed to access resource field', () => {
      expect(() => resource.firstName).toThrowError(CannotAccessFieldError);
    });
  });

  describe('change field value', () => {
    beforeEach(() => {
      schema = {
        validator: {
          isFieldValid: () => true
        },
        authorization: {
          authorizer: {
            canDelete: () => true,
            canAccessField: () => false,
            canUpdateField: vi.fn(() => false),
            canCreate: () => true
          }
        }
      };
      resource = createArticleResource(schema);
    });

    it('Should refuse actor when not allowed to access resource field', () => {
      expect(() => resource.firstName = '123').toThrowError(CannotUpdateFieldError);

      const firstCall = (schema.authorization.authorizer.canUpdateField as any).calls[0];

      expect(firstCall[0]).toBeInstanceOf(ArticleResource);
      expect(firstCall[1]).toStrictEqual('firstName');
      expect(firstCall[2]).toStrictEqual('123');
      expect(firstCall[3]).toBeUndefined();
    });
  });
});
