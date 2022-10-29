import { createCustomDecorator } from '../../factories/custom-decorator.js';

/**
 * Returns the ctx.ip
 */
export function Ip (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, 'ip')
}
