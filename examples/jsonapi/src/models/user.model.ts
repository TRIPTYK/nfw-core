import { BaseEntity, Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRepository } from '../repositories/user.repository.js';
import type { ArticleModel } from './article.model.js';

@Entity({
  customRepository: () => UserRepository
})
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey()
  declare id : string;

  @Property()
    declare username : string;

    @OneToMany('ArticleModel', 'writer')
  public articles = new Collection<ArticleModel>(this);
}
