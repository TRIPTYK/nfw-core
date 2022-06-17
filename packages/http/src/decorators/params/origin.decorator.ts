import { createCustomDecorator } from '../../factories/custom-decorator.factory.js';

/**
 * Returns ctx.origin
 */
export function Origin (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.origin;
  }, 'origin')
}
