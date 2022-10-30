import { createCustomDecorator } from '../../utils/custom-decorator.js';

/**
 * Returns Koa router context
 */
export function Ctx (this: unknown) {
  return createCustomDecorator(({ ctx }) => ctx, 'router-context');
}
