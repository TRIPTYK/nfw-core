import 'reflect-metadata'

export { createApplication } from './factory/create-application.js'
export * from './factory/custom-decorator.js';

export * from './decorators/controller.decorator.js';
export * from './decorators/route.decorator.js';
export * from './decorators/params/body.decorator.js';
export * from './decorators/params/param.decorator.js';
export * from './decorators/use-middleware.decorator.js';
export * from './decorators/use-guard.decorator.js';

export * from './middlewares/middleware.interface.js';
export * from './guards/guard.interface.js';
