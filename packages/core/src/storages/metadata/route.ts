import type { Class } from 'type-fest';
import type { RouterBuilderInterface } from '../../interfaces/router-builder.js';

export interface RouteMetadataArgs<T> {
    target: Class<unknown>,
    controllers?: Class<unknown>[],
    args: T,
    builder: Class<RouterBuilderInterface>,
}
