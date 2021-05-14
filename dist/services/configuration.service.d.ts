import { DatabaseType } from "typeorm";
import { BaseService } from "./base.service";
export declare type Configuration = {
    env?: string;
    port?: number;
    url?: string;
    authorized?: string | string[];
    api?: {
        name: string;
        version: string;
    };
    cachingEnabled?: boolean;
    authMode?: string;
    jwt?: {
        refreshExpires: number;
        accessExpires: number;
        secret: string;
    };
    elastic?: {
        enabled: boolean;
        url: string;
    };
    facebook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    outlook?: {
        id: string;
        redirect: string;
        secret: string;
    };
    google?: {
        id: string;
        redirect: string;
        secret: string;
    };
    typeorm?: {
        database: string;
        host: string;
        name: string;
        synchronize: boolean;
        entities: string[];
        port: number;
        pwd: string;
        type: DatabaseType;
        user: string;
        tableName: string;
        migrationsDir: string;
        entitiesDir: string;
        migrations: string[];
        seeds: string;
        factories: string;
    };
    deploy?: {
        ip: string;
        user: string;
        path: string;
        key: string;
        repo: string;
        ref: string;
    };
    jimp?: {
        isActive: boolean;
        md: number;
        xl: number;
        xs: number;
    };
    mailgun?: {
        privateKey: string;
        publicKey: string;
        domain: string;
        host: string;
    };
    https?: {
        ca: string;
        cert: string;
        isActive: boolean;
        key: string;
    };
    oAuthKey: string;
};
export declare class ConfigurationService<T = Configuration> extends BaseService {
    private _config;
    get config(): T;
    constructor();
    loadConfiguration(): T;
    getKey(key: keyof T): T[keyof T];
    init(): void;
}
