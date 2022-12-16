import type { OperatorMap } from '@mikro-orm/core/typings.js';
import { container } from '@triptyk/nfw-core';
import { MetadataStorage } from '../storage/metadata-storage.js';

export interface AttributeOptions {
  filterable?: false | Partial<Record<keyof OperatorMap<unknown>, boolean | ((value: unknown) => boolean)>>,
  sortable?: boolean | ('ASC' | 'DESC')[],
  updateable?: boolean,
  createable?: boolean,
  fetchable?: boolean,
  isVirtual?: boolean,
}

export function Attribute (options?: AttributeOptions) {
  return function (target: unknown, propertyName: string) {
    container.resolve(MetadataStorage).attributes.push({
      target,
      propertyName,
      options
    });
  };
}
