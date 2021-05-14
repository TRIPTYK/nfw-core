/**
 * Delete an endpoint of a specific route.
 * @param prefix Prefix of the route.
 * @param methodName Ts Method.
 */
export declare function deleteEndpoint(prefix: string, methodName: string): Promise<void>;
export declare function deleteEndpointByUri(prefix: string, subroute: string, requestMethod: string): Promise<void>;
