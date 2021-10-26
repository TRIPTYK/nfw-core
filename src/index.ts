import 'reflect-metadata'

export { createApplication as default } from './factory/create-application.js';
export { databaseInjectionToken } from './factory/create-application.js';
export * from './factory/custom-decorator.js';

export * from './decorators/controller.decorator.js';
export * from './decorators/route.decorator.js';
export * from './decorators/params/body.decorator.js';
export * from './decorators/params/param.decorator.js';
export * from './decorators/use-middleware.decorator.js';
export * from './decorators/use-guard.decorator.js';
export * from './decorators/inject-repository.decorator.js';
export * from './decorators/use-response-handler.js';
export * from './decorators/use-error-handler.decorator.js';

export * from './error-handler/error-middleware.interface.js';
export * from './response-handlers/response-handler.interface.js';
export * from './middlewares/middleware.interface.js';
export * from './guards/guard.interface.js';

export * from 'tsyringe';
