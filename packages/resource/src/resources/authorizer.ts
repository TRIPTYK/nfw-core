export interface ResourceAuthorizer {
    canAccessField: (field: string, value: unknown, actor: unknown) => boolean,
    canCreateResource: (actor: unknown) => boolean,
  }
