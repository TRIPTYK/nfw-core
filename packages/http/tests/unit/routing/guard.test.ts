import 'reflect-metadata';
import type { GuardInterface } from '../../../src/interfaces/guard.js';
import { callGuardWithParams, isSpecialHandle, resolveSpecialContext } from '../../../src/routing/guard-action.js';
import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import { ForbiddenError } from '../../../src/errors/forbidden.js';

describe('Guard routing build', () => {
  describe('is-special-handle', () => {
    it('args and controller-context are the only special handles', () => {
      expect(isSpecialHandle('args')).toStrictEqual(true);
      expect(isSpecialHandle('controller-context')).toStrictEqual(true);
      expect(isSpecialHandle('soemthing' as any)).toStrictEqual(false);
      expect(isSpecialHandle((() => {}) as any)).toStrictEqual(false);
    });
  });
  describe('resolve special context', () => {
    const args: unknown[] = [];
    const controllerInstance = new class {}();

    function makeMeta (handleName: string) {
      return {
        handle: handleName
      } as any;
    }

    it('if special context is args, it returns args', () => {
      expect(resolveSpecialContext(makeMeta('args'), args, {} as any, controllerInstance)).toStrictEqual(args);
    });
    it('if special context is controller-context, it returns controller-context', () => {
      expect(resolveSpecialContext(makeMeta('controller-context'), args, 'action', controllerInstance)).toStrictEqual({ controllerAction: 'action', controllerInstance });
    });
  });
  describe('Guard behavior', () => {
    let guardInstance : GuardInterface;
    let returnValue: boolean;
    let canFunction: jest.MockedFunction<any>;

    beforeEach(() => {
      canFunction = jest.fn(() => returnValue);
      guardInstance = new class implements GuardInterface {
        public async can (...args: unknown[]) {
          return canFunction(...args);
        }
      }();
    });

    it('Guard throw error when returning other than true', async () => {
      returnValue = false;
      expect(() => callGuardWithParams(guardInstance, ['a'])).rejects.toThrowError(ForbiddenError);
      expect(canFunction).toBeCalledTimes(1);
      expect(canFunction).toBeCalledWith('a');
    });
    it('Guard does not throw error when returning true', async () => {
      returnValue = true;
      expect(() => callGuardWithParams(guardInstance, ['a'])).not.toThrowError();
      expect(canFunction).toBeCalledTimes(1);
      expect(canFunction).toBeCalledWith('a');
    });
  });
});
