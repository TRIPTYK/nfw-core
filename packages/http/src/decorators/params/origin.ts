import { createCustomDecorator } from '../../utils/custom-decorator.js';

export function Origin (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.origin;
  }, 'origin');
}
