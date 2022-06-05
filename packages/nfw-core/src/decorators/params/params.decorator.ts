import { createCustomDecorator } from '../../index.js';

export function Params (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params;
  }, 'params');
}
