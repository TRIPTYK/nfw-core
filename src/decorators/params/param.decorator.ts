import { createCustomDecorator } from '../../index.js';

/**
 * Returns a param from ctx.params
 */
export function Param (this: unknown, name: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params[name];
  }, 'param', false);
}