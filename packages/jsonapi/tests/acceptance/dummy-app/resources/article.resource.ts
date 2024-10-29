// eslint-disable-next-line max-classes-per-file
import { container } from '@triptyk/nfw-core';
import { Attribute, JsonApiResource, Relationship, Resource, ResourceService } from '../../../../src/index.js';
import { ArticleModel } from '../models/article.model.js';
import type { CommentResource } from './comment.resource.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { LocaleResource } from './locale.resource.js';
import { MikroORM } from '@mikro-orm/core';

class ArticleService extends ResourceService<ArticleModel> {
  public constructor () {
    super(container.resolve(MikroORM));
  }
}

@JsonApiResource({
  entityName: 'article',
  entity: ArticleModel,
  service: ArticleService
})
export class ArticleResource extends Resource<ArticleModel> {
  @Attribute({
    filterable: {
      $like: true
    }
  })
  public id?: string | undefined;

  @Relationship({
    otherResource: 'CommentResource'
  })
  public declare comments: CommentResource[];

  @Relationship({
    otherResource: 'LocaleResource'
  })
  public declare locale: LocaleResource;
}
