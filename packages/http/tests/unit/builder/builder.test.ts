import { Next } from 'koa';
import 'reflect-metadata';
import { expect, test, vi } from "vitest";
import { DefaultBuilder, HttpMethod, MetadataStorage } from "../../../src/index.js";

class Controller {
    truc() {}
};

const middleware = vi.fn()

function methodWithMiddleware(metadataStorage: MetadataStorage) {
    metadataStorage.addEndpoint({
        args: {
            routeName: '/endpoint',
        },
        target: Controller.prototype,
        propertyName: "truc",
        method: HttpMethod.GET
    });
    metadataStorage.addMiddlewareUsage({
        middleware,
        propertyName: 'truc',
        target: Controller.prototype,
        type: 'before',
    });
}


test("It builds a router from the meta storage", async () => {
    const metadataStorage = new MetadataStorage();
    methodWithMiddleware(metadataStorage);

    const defaultBuilder = new DefaultBuilder(metadataStorage);
    const controllerInstance = new  Controller();
    const routeName =  '/';

    const router = await defaultBuilder.build({
        controllerInstance,
        args: {
            routeName
        }
    });     

    expect(router.opts.prefix).toStrictEqual('/');

    await router.stack.at(0)?.stack[0]({
        response: {
            body: undefined
        }
    } as never, vi.fn());
    
    expect(middleware).toHaveBeenCalledTimes(1);
});
