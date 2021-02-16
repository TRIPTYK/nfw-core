"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSerializerSchema = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const tsyringe_1 = require("tsyringe");
const configuration_service_1 = require("../services/configuration.service");
class BaseSerializerSchema {
    constructor() {
        /**
         *  Replace page number parameter value in given URL
         */
        this.replacePage = (url, newPage) => decodeURIComponent(url.replace(/(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i, `$1${newPage}$3`));
    }
    get baseUrl() {
        const configurationService = tsyringe_1.container.resolve(configuration_service_1.ConfigurationService);
        return `/api/${configurationService.config.api.version}`;
    }
    topLevelLinks(data, extraData, type) {
        if (extraData.page) {
            const max = Math.ceil(extraData.total / extraData.size);
            return {
                first: `${this.baseUrl}/${type}${this.replacePage(extraData.url, 1)}`,
                last: `${this.baseUrl}/${type}${this.replacePage(extraData.url, max)}`,
                prev: `${this.baseUrl}/${type}${this.replacePage(extraData.url, extraData.page - 1 < 1 ? extraData.page : extraData.page - 1)}`,
                next: `${this.baseUrl}/${type}${this.replacePage(extraData.url, extraData.page - 1 < 1 ? extraData.page : extraData.page - 1)}`,
                self: `${this.baseUrl}/${type}${extraData.url}`,
            };
        }
        return {
            self: `${this.baseUrl}/${type}${extraData.url}`,
        };
    }
    links(data, extraData, type) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}`,
        };
    }
    relationshipLinks(data, extraData, type, relationshipName) {
        return {
            self: `${this.baseUrl}/${type}/${data.id}/relationships/${relationshipName}`,
            related: `${this.baseUrl}/${type}/${data.id}/${relationshipName}`,
        };
    }
    meta(data, extraData, type) {
        //nothing to do
    }
    relationshipMeta(data, extraData, type, relationshipName) {
        // nothing to do
    }
}
exports.BaseSerializerSchema = BaseSerializerSchema;
