/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import type { ResourceSchema, ResourcesRegistry } from 'resources';
import { AbstractResourceValidator, AbstractResourceAdapter, AbstractResource, AbstractResourceFactory, AbstractResourceAuthorizer } from 'resources';
import { JsonApiResourceDeserializer } from '../../src/deserializer.js';
import { JsonApiResourceSerializer } from '../../src/serializer.js';
import type { ArticleResource } from './article.js';

export class UserFactory extends AbstractResourceFactory<UserResource> {}

export class UserResource extends AbstractResource {
  public declare name: string;
  public declare articles: ArticleResource[];
}

export class UserValidator extends AbstractResourceValidator<UserResource> {
  validate (resource: UserResource) {}
}

export class UserSchema implements ResourceSchema<UserResource> {
  attributes = ['name'] as const;
  relationships = {
    articles: 'article'
  };

  type = 'user';
}

export class UserDeserializer extends JsonApiResourceDeserializer<UserResource> {}
export class UserSerializer extends JsonApiResourceSerializer<UserResource> {}

export class UserAdapter extends AbstractResourceAdapter<UserResource> {
  protected saveToDatasource (resource: UserResource): unknown {
    throw new Error('Method not implemented.');
  }
}

export class UserAuthorizer extends AbstractResourceAuthorizer<string, UserResource, 'create', unknown> {
  public can (actor: string, doAction: 'create', on: UserResource, inContext: unknown) {
    return true;
  }
}

export function registerUser (registry: ResourcesRegistry) {
  registry.register('user', {
    deserializer: UserDeserializer,
    schema: UserSchema,
    resourceClass: UserResource,
    serializer: UserSerializer,
    factory: UserFactory,
    adapter: UserAdapter,
    authorizer: UserAuthorizer,
    validator: UserValidator
  });
}
