import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import type { ArticleModel } from './article.model.js';

@Entity()
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey()
  declare id : string;

  @Property()
    declare username : string;

    @OneToMany('ArticleModel', 'writer')
  public articles = new Collection<ArticleModel>(this);
}
