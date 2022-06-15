export { createApplication as default } from './factories/application.factory.js';

export * from './decorators/controller.decorator.js';
export * from './decorators/route.decorator.js';

export * from './decorators/use-middleware.decorator.js';
export * from './decorators/use-error-handler.decorator.js';

export * from './utils/factory.util.js';

export * from './builders/base.builder.js';
export * from './interfaces/builder.interface.js';

export * from './storages/metadata-storage.js';

export { Class } from './types/class.js';

export * from './interfaces/error-middleware.interface.js';
export * from './interfaces/middleware.interface.js';

export * from 'tsyringe';
