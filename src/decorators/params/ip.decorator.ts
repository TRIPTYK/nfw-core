import { createCustomDecorator } from '../../index.js'

export function Ip (this : Function) {
  return createCustomDecorator(({ ctx }) => {
    return ctx.ip;
  }, this.name)
}
