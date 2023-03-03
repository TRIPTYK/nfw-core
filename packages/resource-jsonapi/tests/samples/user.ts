/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import type { ResourceSchema, ResourcesRegistry } from 'resources';
import { ResourceValidator, ResourceAuthorizer, ResourceFactory, Resource } from 'resources';
import { ResourceAdapter } from 'resources/build/src/adapter.js';
import { JsonApiResourceDeserializer } from '../../src/deserializer.js';
import type { ArticleResource } from './article.js';

export class UserFactory extends ResourceFactory<UserResource> {}

export class UserResource extends Resource {
  public id?: string | undefined;
  public declare name: string;
  public declare articles: ArticleResource[];
}

export class UserValidator extends ResourceValidator<UserResource> {
  validate (resource: UserResource) {}
}

export class UserSchema implements ResourceSchema<UserResource> {
  attributes = ['name'] as const;
  relationships = {
    articles: 'article'
  };

  type = 'user';
}

export class UserDeserializer extends JsonApiResourceDeserializer<UserResource> {

}

export class UserAdapter extends ResourceAdapter<UserResource> {
  protected saveToDatasource (resource: UserResource): unknown {
    throw new Error('Method not implemented.');
  }
}

export class UserAuthorizer extends ResourceAuthorizer<string, UserResource, 'create', unknown> {
  public can (actor: string, doAction: 'create', on: UserResource, inContext: unknown) {
    return true;
  }
}

export function registerUser (registry: ResourcesRegistry) {
  registry.register('user', {
    deserializer: UserDeserializer,
    schema: UserSchema,
    resourceClass: UserResource,
    serializer: UserDeserializer as never,
    factory: UserFactory,
    adapter: UserAdapter,
    authorizer: UserAuthorizer,
    validator: UserValidator
  });
}
