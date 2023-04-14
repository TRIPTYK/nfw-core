/* eslint-disable @typescript-eslint/ban-types */
import { ConditionalExcept, Exact } from "type-fest";
import { Resource } from "../resource/resource.js";

export type ResourceProperties<T extends Resource> = Exact<Omit<ConditionalExcept<T, Function>, 'type'>, Omit<ConditionalExcept<T, Function>, 'type'>>;

