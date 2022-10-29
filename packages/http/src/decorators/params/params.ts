import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Params (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.params;
  }, 'params');
}
