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
const dotenv = require("dotenv");
const path_1 = require("path");
const tsyringe_1 = require("tsyringe");
const string_parse_util_1 = require("../utils/string-parse.util");
const base_service_1 = require("./base.service");
let ConfigurationService = class ConfigurationService extends base_service_1.default {
    constructor() {
        super();
        this._config = this.loadConfiguration();
    }
    get config() {
        return this._config;
    }
    loadConfiguration() {
        const { parsed: loaded } = dotenv.config({
            path: path_1.join(process.cwd(), `${process.env.NODE_ENV ?? "development"}.env`)
        });
        const applyObj = {};
        applyObj.env = loaded.NODE_ENV;
        applyObj.port = parseInt(loaded.PORT, 10);
        applyObj.url = loaded.URL;
        applyObj.authorized =
            loaded.AUTHORIZED === "*" ? true : loaded.AUTHORIZED.split(",");
        applyObj.api = {
            version: loaded.API_VERSION,
            name: loaded.API_NAME
        };
        applyObj.cachingEnabled = string_parse_util_1.parseBool(loaded.REQUEST_CACHING);
        applyObj.authMode = ["jwt", "session"].includes(loaded.AUTH_MODE)
            ? loaded.AUTH_MODE
            : "jwt";
        applyObj.deploy = {
            ip: loaded.DEPLOY_IP,
            user: loaded.DEPLOY_USER,
            path: loaded.DEPLOY_PATH,
            ref: loaded.DEPLOY_REF,
            repo: loaded.DEPLOY_REPO,
            key: loaded.DEPLOY_KEY
        };
        applyObj.jwt = {
            accessExpires: parseInt(loaded.JWT_ACCESS_EXPIRATION_MINUTES, 10),
            refreshExpires: parseInt(loaded.JWT_REFRESH_EXPIRATION_MINUTES, 10),
            secret: loaded.JWT_SECRET
        };
        applyObj.elastic = {
            enabled: string_parse_util_1.parseBool(loaded.ELASTIC_ENABLE),
            url: loaded.ELASTIC_URL
        };
        applyObj.facebook = {
            id: loaded.FACEBOOK_KEY,
            redirect: loaded.FACEBOOK_REDIRECT_URL,
            secret: loaded.FACEBOOK_SECRET
        };
        applyObj.outlook = {
            id: loaded.OUTLOOK_KEY,
            redirect: loaded.OUTLOOK_REDIRECT_URL,
            secret: loaded.OUTLOOK_SECRET
        };
        applyObj.google = {
            id: loaded.GOOGLE_KEY,
            redirect: loaded.GOOGLE_REDIRECT_URL,
            secret: loaded.GOOGLE_SECRET
        };
        applyObj.typeorm = {
            database: loaded.TYPEORM_DB,
            host: loaded.TYPEORM_HOST,
            name: loaded.TYPEORM_NAME,
            port: parseInt(loaded.TYPEORM_PORT, 10),
            pwd: loaded.TYPEORM_PWD,
            synchronize: string_parse_util_1.parseBool(loaded.TYPEORM_SYNCHRONIZE),
            entities: loaded.TYPEORM_ENTITIES.split(","),
            type: ["mariadb", "mysql", "oracle", "postgresql"].includes(loaded.TYPEORM_TYPE)
                ? loaded.TYPEORM_TYPE
                : "mysql",
            user: loaded.TYPEORM_USER,
            tableName: loaded.TYPEORM_MIGRATIONS_TABLE_NAME,
            entitiesDir: loaded.TYPEORM_ENTITIES_DIR,
            migrationsDir: loaded.TYPEORM_MIGRATIONS_DIR,
            migrations: loaded.TYPEORM_MIGRATIONS.split(","),
            seeds: loaded.TYPEORM_SEEDING_SEEDS,
            factories: loaded.TYPEORM_SEEDING_FACTORIES
        };
        applyObj.jimp = {
            isActive: string_parse_util_1.parseBool(loaded.JIMP_IS_ACTIVE),
            md: parseInt(loaded.JIMP_SIZE_MD, 10),
            xl: parseInt(loaded.JIMP_SIZE_XL, 10),
            xs: parseInt(loaded.JIMP_SIZE_XS, 10)
        };
        applyObj.https = {
            ca: loaded.HTTPS_CHAIN,
            cert: loaded.HTTPS_CERT,
            isActive: string_parse_util_1.parseBool(loaded.HTTPS_IS_ACTIVE),
            key: loaded.HTTPS_KEY
        };
        applyObj.mailgun = {
            domain: loaded.MAILGUN_DOMAIN,
            host: loaded.MAILGUN_HOST,
            privateKey: loaded.MAILGUN_API_KEY,
            publicKey: loaded.MAILGUN_PUBLIC_KEY
        };
        applyObj.oAuthKey = loaded.OAUTH_KEY;
        return { ...loaded, ...applyObj };
    }
    getKey(key) {
        return this._config[key];
    }
    init() {
        // eslint-disable-next-line no-useless-return
        return;
    }
};
ConfigurationService = __decorate([
    tsyringe_1.singleton(),
    __metadata("design:paramtypes", [])
], ConfigurationService);
exports.default = ConfigurationService;
//# sourceMappingURL=configuration.service.js.map