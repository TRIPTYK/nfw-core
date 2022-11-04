import { BaseEntity, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ArticleModel } from './article.model.js';

@Entity()
export class LocaleModel extends BaseEntity<LocaleModel, 'id'> {
  @PrimaryKey()
  public declare id: string;

  @ManyToOne('ArticleModel', 'comments')
  public declare article: ArticleModel;
}
