/* eslint-disable @typescript-eslint/consistent-type-imports */
// eslint-disable-next-line max-classes-per-file
import { container } from '@triptyk/nfw-core';
import { Attribute, JsonApiResource, Relationship, Resource, ResourceService } from '../../../../src/index.js';
import { LocaleModel } from '../models/locale.model.js';
import type { ArticleResource } from './article.resource.js';
import type { CommentResource } from './comment.resource.js';
import { ArticleModel } from '../models/article.model.js';
import { MikroORM } from '@mikro-orm/core';

class LocaleService extends ResourceService<ArticleModel> {
  public constructor () {
    super(container.resolve(MikroORM));
  }
}

@JsonApiResource({
  entityName: 'locale',
  entity: LocaleModel,
  service: LocaleService
})
export class LocaleResource extends Resource<LocaleModel> {
  @Attribute({
    filterable: {
      $like: true
    }
  })
  public id?: string | undefined;

  @Relationship({
    otherResource: 'CommentResource'
  })
  public declare comment: CommentResource;

  @Relationship({
    otherResource: 'ArticleResource'
  })
  public declare article: ArticleResource;
}
