import { MetadataStorage } from '../../src/storages/metadata-storage.js';

describe('Metadata storage tests', () => {
  function makeParamFor (target: unknown, propertyName: string, index: number) {
    return {
      index,
      decoratorName: '',
      target,
      propertyName,
      handle: () => {},
      args: []
    }
  }

  it('gets sorted params for target property', () => {
    class TheTarget {
      public cmonDoSomething () {}
    }

    const metadataStorage = new MetadataStorage();

    const firstParam = makeParamFor(TheTarget.prototype, 'cmonDoSomething', 0);
    const secondParam = makeParamFor(TheTarget.prototype, 'cmonDoSomething', 1);

    metadataStorage.useParams.push(secondParam, firstParam);

    expect(metadataStorage.sortedParametersFor(TheTarget, 'cmonDoSomething')).toStrictEqual([firstParam, secondParam]);
  })
})
