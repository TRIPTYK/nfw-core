export interface SerializedResourceType {
    type: string,
    id: string,
    attributes: Record<string, unknown>,
    relationships?: Record<string, unknown>,
  }
