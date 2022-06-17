import { createCustomDecorator } from '../../factories/custom-decorator.factory.js';

export function Params (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params;
  }, 'params');
}
