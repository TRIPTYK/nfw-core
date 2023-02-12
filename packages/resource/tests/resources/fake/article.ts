import { vi } from 'vitest';
import type { ResourceAuthorizer } from '../../../src/resources/authorizer.js';
import { createExistingResource, createResource } from '../../../src/resources/create-resource.js';
import type { ResourceSchema } from '../../../src/resources/schema.js';

export class ArticleResource {
  public firstName?: string;
}

const articleStructure = {
  firstName: {
    type: 'string'
  }
};

export const alwaysValidSchema = {
  validator: {
    isFieldValid: () => vi.fn(() => true)
  },
  authorization: {
    authorizer: {
      canUpdateField: () => vi.fn(() => true),
      canDelete: () => vi.fn(() => true),
      canAccessField: () => vi.fn(() => true),
      canCreate: vi.fn(() => true)
    }
  }
} satisfies StructureLessArticleSchema;

export type ArticleResourceAuthorizer = ResourceAuthorizer<ArticleResource>;

export type StructureLessArticleSchema = Omit<ResourceSchema<ArticleResource>, 'structure'>

export function createArticleResource (overrides: StructureLessArticleSchema) {
  return createResource(new ArticleResource(), {
    structure: articleStructure,
    ...overrides
  });
}

export function createExistingArticleResource (overrides: StructureLessArticleSchema) {
  return createExistingResource(new ArticleResource(), {
    structure: articleStructure,
    ...overrides
  });
}
