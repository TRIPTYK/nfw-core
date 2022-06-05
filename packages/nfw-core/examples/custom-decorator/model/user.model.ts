import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class UserModel extends BaseEntity<any, string> {
  @PrimaryKey({
    type: 'varchar'
  })
  declare id: string;

  @Property({
    type: 'varchar'
  })
  declare username: string;
}
