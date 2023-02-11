import type { StringKeyOf } from 'type-fest';

export interface ResourceAuthorizer<T extends object> {
    canAccessField: (resource: T, field: StringKeyOf<T>, value: unknown, actor: unknown) => boolean,
    canCreate: (actor: unknown) => boolean,
    canDelete: (resource: T, actor: unknown) => boolean,
    canUpdateField: (resource: T, field: StringKeyOf<T>, newValue: unknown) => boolean,
  }
