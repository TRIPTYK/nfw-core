import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { ArticleModel } from './article.model.js';
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
