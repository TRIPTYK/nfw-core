import { createCustomDecorator } from '../../factories/custom-decorator.factory.js'

/**
 * Returns Koa router context
 */
export function Ctx (this: unknown) {
  return createCustomDecorator(({ ctx }) => ctx, 'router-context', false);
}
