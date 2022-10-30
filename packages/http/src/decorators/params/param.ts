import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Param (this: unknown, name: string) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params[name];
  }, 'param');
}
