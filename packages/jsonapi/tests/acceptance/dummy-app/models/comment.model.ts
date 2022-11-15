import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { ArticleModel } from './article.model.js';
import type { LocaleModel } from './locale.model.js';

@Entity()
export class CommentModel extends BaseEntity<CommentModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @Property({
    default: 'title'
  })
  public declare title?: string;

  @ManyToOne('ArticleModel', 'comments')
  public declare article: ArticleModel;

  @OneToMany('LocaleModel', 'comment')
  public locales = new Collection<LocaleModel>(this);
}
