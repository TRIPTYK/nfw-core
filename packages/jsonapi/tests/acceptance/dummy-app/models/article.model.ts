import { BaseEntity, PrimaryKey, Collection, OneToMany, Entity, OneToOne } from '@mikro-orm/core';
import type { CommentModel } from './comment.model.js';
import { LocaleModel } from './locale.model.js';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @OneToMany('CommentModel', 'article')
  public comments = new Collection<CommentModel>(this);

  @OneToOne('LocaleModel', 'article', {
    nullable: true,
    owner: true
  })
  public locale? : LocaleModel;
}
