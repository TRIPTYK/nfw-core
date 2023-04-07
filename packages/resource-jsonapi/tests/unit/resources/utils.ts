export function defaultAttribute() {
    return {
      serialize: true,
      deserialize: true,
      type: 'string'
    } as const
  }
  
export function defaultRelation(type: string, target: string) {
    return {
      serialize: true,
      deserialize: true,
      type,
      target
    } as const
  }
  