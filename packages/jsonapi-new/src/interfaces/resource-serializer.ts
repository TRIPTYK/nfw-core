import type { SerializedResourceType } from '../types/serialized-resource.js';
import type { ResourceInterface } from './resource.js';

export interface ResourceSerializerInterface {
  serialize(resource: ResourceInterface): SerializedResourceType,
}
