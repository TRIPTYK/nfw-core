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

export type ArticleResourceAuthorizer = ResourceAuthorizer<ArticleResource>;

export type StructureLessArticleSchema = Omit<ResourceSchema<ArticleResource>, 'structure'>

export function createArticleResource (overrides: StructureLessArticleSchema) {
  return createResource(ArticleResource, {
    structure: articleStructure,
    ...overrides
  });
}

export function createExistingArticleResource (overrides: StructureLessArticleSchema) {
  return createExistingResource(ArticleResource, {
    structure: articleStructure,
    ...overrides
  });
}
