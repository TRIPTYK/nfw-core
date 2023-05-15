import { describe, expect, it } from 'vitest';
import type { SchemaAttributes } from '../../../src';
import { filterForWhitelist } from '../../../src/utils/whitelist-filter.js';
import { defaultAttribute } from '../test-utils/default-schema-parts.js';

const fakeSchemaForSerializeFilter: SchemaAttributes = {
  serializable: defaultAttribute(),
  unserializable: {
    ...defaultAttribute(),
    serialize: false,
  },
};

const fakeSchemaForDeserializeFilter: SchemaAttributes = {
  deserializable: defaultAttribute(),
  undeserializable: {
    ...defaultAttribute(),
    deserialize: false,
  },
};

describe('Filter For Serialize', () => {
  it('return arrays containing only serializable attributes', () => {
    const filteredArray = filterForWhitelist(fakeSchemaForSerializeFilter, 'serialize');
    expect(filteredArray).includes('serializable');
    expect(filteredArray).not.includes('unserializable');
  });
});

describe('Filter For Deserialize', () => {
  it('return arrays containing only serializable attributes', () => {
    const filteredArray = filterForWhitelist(fakeSchemaForDeserializeFilter, 'deserialize');
    expect(filteredArray).contains('deserializable');
    expect(filteredArray).not.includes('undeseriazable');
  });
});
