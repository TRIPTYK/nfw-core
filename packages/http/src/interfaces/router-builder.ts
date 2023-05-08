import type Router from '@koa/router';
import type Application from 'koa';

export interface RouterBuilderArguments<T> {
    controllerInstance: InstanceType<any>,
    args: T,
}

export interface RouterBuilderInterface<T> {
    build(context: RouterBuilderArguments<T>) : Promise<Router>,
    bindRouting(parentRouter: Router | Application, router: Router) : Promise<void>,
}
