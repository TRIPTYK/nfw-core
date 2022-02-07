
import {
  ALL,
  Controller,
  DELETE,
  GET,
  OPTIONS,
  PATCH,
  POST,
  PUT
} from '../../../../src/index.js';

@Controller('/methods')
export class MethodsController {
  @GET('/get')
  get () {}

  @PUT('/put')
  put () {}

  @PATCH('/patch')
  patch () {}

  @POST('/post')
  post () {}

  @DELETE('/delete')
  delete () {}

  @ALL('/all')
  all () {}

  @OPTIONS('/head')
  head () {}

  @OPTIONS('/options')
  options () {}
}
