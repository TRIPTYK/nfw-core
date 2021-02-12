import "reflect-metadata";
import { Connection, ConnectionOptions } from "typeorm";
import { BaseService } from "./base.service";
import { ConfigurationService } from "./configuration.service";
/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
export declare class TypeORMService extends BaseService {
    private configurationService;
    private _connection;
    constructor(configurationService: ConfigurationService);
    init(): Promise<void>;
    disconnect(): Promise<void>;
    get connection(): Connection;
    get ConfigurationObject(): ConnectionOptions;
}
