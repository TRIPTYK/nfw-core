import 'reflect-metadata';
import { isSpecialHandle, resolveSpecialContext } from '../../../src/routing/guard-action.js'

describe('Guard routing build', () => {
  describe('is-special-handle', () => {
    it('args and controller-context are the only special handles', () => {
      expect(isSpecialHandle('args')).toStrictEqual(true);
      expect(isSpecialHandle('controller-context')).toStrictEqual(true);
      expect(isSpecialHandle('soemthing' as any)).toStrictEqual(false);
      expect(isSpecialHandle((() => {}) as any)).toStrictEqual(false);
    })
  });
  describe('resolve special context', () => {
    const args: unknown[] = [];
    const controllerInstance = new class {}();

    function makeMeta (handleName: string) {
      return {
        metadata: {
          handle: handleName
        }
      } as any;
    }

    it('if special context is args, it returns args', () => {
      expect(resolveSpecialContext(makeMeta('args'), args, {} as any, controllerInstance)).toStrictEqual(args);
    });
    it('if special context is controller-context, it returns controller-context', () => {
      expect(resolveSpecialContext(makeMeta('controller-context'), args, {} as any, controllerInstance)).toStrictEqual({ controllerAction: undefined, controllerInstance });
    })
  })
})
