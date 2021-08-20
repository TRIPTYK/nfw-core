import "reflect-metadata";
import { autoInjectable, singleton } from "tsyringe";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { BaseService } from "./base.service";
import { ConfigurationService } from "./configuration.service";

/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
@singleton()
@autoInjectable()
export class TypeORMService extends BaseService {
  private _connection: Connection;

  public constructor(private configurationService: ConfigurationService) {
    super();
  }

  public async init() {
    this._connection = await createConnection(this.ConfigurationObject);
  }

  public async disconnect() {
    await this._connection.close();
  }

  public get connection() {
    return this._connection;
  }

  public get ConfigurationObject(): ConnectionOptions {
    const { typeorm } = this.configurationService.config;

    return {
      database: typeorm.database,
      entities: typeorm.entities,
      synchronize: typeorm.synchronize,
      host: typeorm.host,
      name: typeorm.name,
      password: typeorm.pwd,
      port: typeorm.port,
      type: typeorm.type as any,
      migrations: typeorm.migrations,
      username: typeorm.user,
      subscribers: typeorm.subscribers,
      cli: {
        entitiesDir: typeorm.entitiesDir,
        migrationsDir: typeorm.migrationsDir,
      },
    };
  }
}
