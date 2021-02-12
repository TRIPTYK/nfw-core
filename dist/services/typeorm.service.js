"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const base_service_1 = require("./base.service");
const configuration_service_1 = require("./configuration.service");
/**
 * Define TypeORM default configuration
 *
 * @inheritdoc https://http://typeorm.io
 */
let TypeORMService = class TypeORMService extends base_service_1.default {
    constructor(configurationService) {
        super();
        this.configurationService = configurationService;
    }
    async init() {
        this._connection = await typeorm_1.createConnection(this.ConfigurationObject);
    }
    async disconnect() {
        await this._connection.close();
    }
    get connection() {
        return this._connection;
    }
    get ConfigurationObject() {
        const { typeorm } = this.configurationService.config;
        return {
            database: typeorm.database,
            entities: typeorm.entities,
            synchronize: typeorm.synchronize,
            host: typeorm.host,
            name: typeorm.name,
            password: typeorm.pwd,
            port: typeorm.port,
            type: typeorm.type,
            migrations: typeorm.migrations,
            username: typeorm.user,
            cli: {
                entitiesDir: typeorm.entitiesDir,
                migrationsDir: typeorm.migrationsDir,
            },
        };
    }
};
TypeORMService = __decorate([
    tsyringe_1.singleton(),
    tsyringe_1.autoInjectable(),
    __metadata("design:paramtypes", [configuration_service_1.default])
], TypeORMService);
exports.default = TypeORMService;
//# sourceMappingURL=typeorm.service.js.map