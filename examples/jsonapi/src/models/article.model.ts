import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ArticleModel extends BaseEntity<ArticleModel, 'id'> {
    @PrimaryKey()
  declare id : string;

    @Property()
    declare title : string;
}
