/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import type { ResourceSchema, ResourcesRegistry } from 'resources';
import { AbstractResourceAuthorizer, AbstractResourceValidator, AbstractResourceFactory, AbstractResource } from 'resources';
import { vi } from 'vitest';
import { JsonApiResourceAdapter } from '../../src/adapter.js';
import { JsonApiResourceDeserializer } from '../../src/deserializer.js';
import { JsonApiResourceSerializer } from '../../src/serializer.js';
import type { UserResource } from './user.js';

export class ArticleFactory extends AbstractResourceFactory<ArticleResource> {

}

export class ArticleResource extends AbstractResource {
  public id?: string | undefined;
  public declare name: string;
  public declare writer: UserResource;
  public validate () {}
}

export class ArticleSchema implements ResourceSchema<ArticleResource> {
  attributes = ['name'] as const;
  relationships = {
    writer: 'user'
  };

  type = 'article';
}

export class ArticlesDeserializer extends JsonApiResourceDeserializer<ArticleResource> {}
export class ArticlesSerializer extends JsonApiResourceSerializer<ArticleResource> {}

export class ArticleAdapter extends JsonApiResourceAdapter<ArticleResource> {
  create = vi.fn();
}

export class ArticleValidator extends AbstractResourceValidator<ArticleResource> {
  validate (resource: ArticleResource): unknown {
    throw new Error('Method not implemented.');
  }
}

export class ArticleAuthorizer extends AbstractResourceAuthorizer<string, ArticleResource, 'create', unknown> {
  public can (actor: string, doAction: 'create', on: ArticleResource, inContext: unknown) {
    return true;
  }
}

export function registerArticle (registry: ResourcesRegistry) {
  registry.register('article', {
    deserializer: ArticlesDeserializer,
    schema: ArticleSchema,
    resourceClass: ArticleResource,
    serializer: ArticlesSerializer,
    factory: ArticleFactory,
    adapter: ArticleAdapter,
    validator: ArticleValidator,
    authorizer: ArticleAuthorizer
  });
}
