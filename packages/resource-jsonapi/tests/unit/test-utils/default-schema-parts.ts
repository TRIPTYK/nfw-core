import { Cardinality, SchemaAttributeTypes } from "../../../src"

export function defaultAttribute() {
    return {
      serialize: true,
      deserialize: true,
      type: 'string' as SchemaAttributeTypes
    }
  }
  
export function defaultRelation(type: string, cardinality: Cardinality) {
    return {
      serialize: true,
      deserialize: true,
      type,
      cardinality
    }
  }
  