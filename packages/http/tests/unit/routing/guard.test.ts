import 'reflect-metadata';
import type { GuardInterface } from '../../../src/interfaces/guard.js';
import { callGuardWithParams } from '../../../src/routing/guard-action.js';
import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import { ForbiddenError } from '../../../src/errors/forbidden.js';

describe('Guard routing build', () => {
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
