import { createCustomDecorator } from '../../factories/custom-decorator.js';

/**
 * Returns context body
 */
export function Body (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return (ctx.request as any).body ?? ctx.body;
  }, 'body');
}
