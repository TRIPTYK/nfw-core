import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ArticleRepository } from '../repositories/article.repository.js';
import { UserModel } from './user.model.js';

@Entity({
  customRepository: () => ArticleRepository
})
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
    @PrimaryKey()
  declare id : string;

    @Property()
    declare title : string;

    @ManyToOne('UserModel', 'articles')
    declare writer: UserModel;
}
