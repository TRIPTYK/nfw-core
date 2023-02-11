export interface ResourceAuthorizer<T extends object> {
    canAccessField: (resource: T, field: string, value: unknown, actor: unknown) => boolean,
    canCreate: (actor: unknown) => boolean,
    canDelete: (resource: T, actor: unknown) => boolean,
  }
