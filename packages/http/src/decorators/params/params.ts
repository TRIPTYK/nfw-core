import { createCustomDecorator } from '../../factories/custom-decorator.js';

export function Params (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params;
  }, 'params');
}
