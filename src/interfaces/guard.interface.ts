import { GuardContext } from "./routes.interface";

export interface GuardInterface {
	/**
	 * Returns true if can continue, otherwise rejects with 403
	 */
	can(context: GuardContext<unknown>): boolean | Promise<boolean>;
}