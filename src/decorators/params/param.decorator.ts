import { createCustomDecorator } from '../../index.js';

export function Param (this: unknown, paramName: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params[paramName];
  }, 'param');
}
