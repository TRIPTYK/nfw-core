export interface GuardInterface {
    can(...args: unknown[]) : Promise<boolean> | boolean,
}
