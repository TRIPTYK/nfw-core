import { ResourcesRegistry } from "../registry/registry";
import { JsonApiQuery } from "./query";


export class QueryValidator {
  constructor(private  registry: ResourcesRegistry, private type: string) {}

  public validate(query: JsonApiQuery) {
  }
}
