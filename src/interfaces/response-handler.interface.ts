import { ResponseHandlerContext } from "./routes.interface";

export interface ResponseHandlerInterface {
	/**
	 * Handle a controller response
	 */
	handle(context: ResponseHandlerContext<unknown>): unknown;
}