import type { RouterContext } from '@koa/router';
import { Params } from '../../../../src/decorators/params/params.decorator.js';
import type { ControllerContextInterface } from '../../../../src/index.js';
import {
  Body,
  Controller,
  ControllerContext,
  Ctx,
  GET,
  Ip,
  Method,
  Origin,
  Param,
  Query,
  QueryParam
} from '../../../../src/index.js';
import type { UsersController } from './controller.js';

@Controller('/decorators')
export class DecoratorsController {
  @GET('/:param1/:param2')
  ip (
    @Ip() ip: string,
    @Body() body: unknown,
    @Method() method: string,
    @Origin() origin: string,
    @Param('param1') param1: string,
    @Param('param2') param2: string,
    @Params() params: Record<'param1' | 'param2', string>,
    @QueryParam('q1') q1: string,
    @Query() query: Record<string, unknown>,
    @Ctx() ctx: RouterContext
  ) {
    return {
      ip,
      body,
      method,
      origin,
      param1,
      param2,
      params,
      q1,
      query,
      ctx
    }
  }

  @GET('/context')
  context (@ControllerContext() context: ControllerContextInterface<UsersController>) {
    return {
      controllerAction: context.controllerAction,
      controllerInstance: context.controllerInstance.constructor.name
    };
  }
}
