import type { ExecutableInterface } from './executable.js';

export interface ResolverInterface {
    resolve(...args: unknown[]): ExecutableInterface | ExecutableInterface[] | undefined,
}
