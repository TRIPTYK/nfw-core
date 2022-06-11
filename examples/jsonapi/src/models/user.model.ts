import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class UserModel extends BaseEntity<UserModel, 'id'> {
    @PrimaryKey()
  declare id : string;

  @Property()
    declare username : string;
}
