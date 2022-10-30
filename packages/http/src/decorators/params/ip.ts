import { createCustomDecorator } from '../../utils/custom-decorator.js';

/**
 * Returns the ctx.ip
 */
export function Ip (this : unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, 'ip');
}
