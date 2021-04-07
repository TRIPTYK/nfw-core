/**
 * Add an endpoint to a specific route.
 * @param prefix Prefix of the route.
 * @param method Method of the endpoint.
 * @param subroute Any subroute that would come after the endpoint.
 */
export declare function addEndpoint(prefix: string, method: string, subroute?: string): Promise<void>;
