
import { createCustomDecorator } from '../../index.js'

/**
 * Returns context body
 */
export function Body (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return (ctx.request as any).body ?? ctx.body;
  }, 'body');
}
