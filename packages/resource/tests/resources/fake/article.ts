import { createResource } from '../../../src/resources/create-resource.js';
import type { ResourceSchema } from '../../../src/resources/schema.js';

export class ArticleResource {
  public firstName?: string;
}

const articleStructure = {
  firstName: {
    type: 'string'
  }
};

export type StructureLessArticleSchema = Omit<ResourceSchema<ArticleResource>, 'structure'>

export function createArticleResource (overrides: StructureLessArticleSchema) {
  return createResource(ArticleResource, {
    structure: articleStructure,
    ...overrides
  });
}
