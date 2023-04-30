/* eslint-disable @typescript-eslint/ban-types */
import { ConditionalExcept, Exact } from "type-fest";

export type ResourceProperties<T extends Record<string, unknown>> = Exact<Omit<ConditionalExcept<T, Function>, 'type'>, Omit<ConditionalExcept<T, Function>, 'type'>>;

