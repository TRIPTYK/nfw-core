import 'reflect-metadata';

export { createApplication as default } from './factories/application.factory.js';
export { databaseInjectionToken } from './factories/application.factory.js';
export * from './factories/custom-decorator.factory.js';

export * from './decorators/controller.decorator.js';
export * from './decorators/route.decorator.js';
export * from './decorators/params/body.decorator.js';
export * from './decorators/params/param.decorator.js';
export * from './decorators/params/query.decorator.js';
export * from './decorators/params/header.decorator.js';
export * from './decorators/params/query-param.decorator.js';
export * from './decorators/params/origin.decorator.js';
export * from './decorators/params/ip.decorator.js';
export * from './decorators/params/method.decorator.js';
export * from './decorators/params/files.decorator.js';
export * from './decorators/params/uploaded.decorator.js';
export * from './decorators/use-middleware.decorator.js';
export * from './decorators/use-guard.decorator.js';
export * from './decorators/inject-repository.decorator.js';
export * from './decorators/use-response-handler.js';
export * from './decorators/use-error-handler.decorator.js';
export * from './decorators/use-not-found-middleware.decorator.js';

export * from './storages/metadata-storage.js';
export { ControllerParamsContext } from './storages/metadata/use-params.metadata.js';

export { Class } from './types/class.js';

export * from './interfaces/error-middleware.interface.js';
export * from './interfaces/response-handler.interface.js';
export * from './interfaces/middleware.interface.js';
export * from './interfaces/guard.interface.js';

export * from 'tsyringe';
