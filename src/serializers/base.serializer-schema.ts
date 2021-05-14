/* eslint-disable @typescript-eslint/no-unused-vars */
import { container } from "tsyringe";
import { ConfigurationService } from "../services/configuration.service";

export abstract class BaseSerializerSchema<T extends Record<string, any>> {
  public get baseUrl() {
    const configurationService = container.resolve<ConfigurationService>(
      ConfigurationService
    );
    return `/api/${configurationService.config.api.version}`;
  }

  /**
   *  Replace page number parameter value in given URL
   */
  protected replacePage = (url: string, newPage: number): string =>
    decodeURIComponent(
      url.replace(
        /(.*page(?:\[|%5B)number(?:]|%5D)=)(?<pageNumber>[0-9]+)(.*)/i,
        `$1${newPage}$3`
      )
    );

  public topLevelMeta(data: T, extraData: any, type: string) {
    return {};
  }

  public topLevelLinks(data: T, extraData: any, type: string) {
    if (extraData.page) {
      const max = Math.ceil(extraData.total / extraData.size);
      return {
        first: `${this.baseUrl}/${type}${this.replacePage(extraData.url, 1)}`,
        last: `${this.baseUrl}/${type}${this.replacePage(extraData.url, max)}`,
        prev: `${this.baseUrl}/${type}${this.replacePage(
          extraData.url,
          extraData.page - 1 < 1 ? extraData.page : extraData.page - 1
        )}`,
        next: `${this.baseUrl}/${type}${this.replacePage(
          extraData.url,
          extraData.page - 1 < 1 ? extraData.page : extraData.page - 1
        )}`,
        self: `${this.baseUrl}/${type}${extraData.url}`,
      };
    }

    return {
      self: `${this.baseUrl}/${type}${extraData.url}`,
    };
  }

  public links(data: T, extraData: any, type: string) {
    return {
      self: `${this.baseUrl}/${type}/${data.id}`,
    };
  }

  public relationshipLinks(
    data: T,
    extraData: any,
    type: string,
    relationshipName: string
  ) {
    return {
      self: `${this.baseUrl}/${type}/${data.id}/relationships/${relationshipName}`,
      related: `${this.baseUrl}/${type}/${data.id}/${relationshipName}`,
    };
  }

  public meta(data: T, extraData: any, type: string) {
    //nothing to do
  }

  public relationshipMeta(
    data: T,
    extraData: any,
    type: string,
    relationshipName
  ) {
    // nothing to do
  }
}
