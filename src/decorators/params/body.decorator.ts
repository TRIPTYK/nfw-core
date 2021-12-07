
import { createCustomDecorator } from '../../index.js'

export function Body (this: unknown) {
  return createCustomDecorator(({ ctx }) => {
    return (ctx.request as any).body;
  }, 'body');
}
