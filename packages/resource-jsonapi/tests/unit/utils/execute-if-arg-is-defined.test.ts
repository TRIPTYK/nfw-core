import { expect, it, vi } from "vitest";
import {ExecuteIfArgIsDefined} from "../../../src/utils/execute-if-args-are-defined";

const spyableFunction = vi.fn((arg: any) => arg)

it("Does not execute if arg is undefined", () => {
  ExecuteIfArgIsDefined(spyableFunction, undefined);
  expect(spyableFunction).not.toBeCalledWith(undefined);
})	
it("Execute If Arg Is Not Undefined", () => {
  ExecuteIfArgIsDefined(spyableFunction, "defined, i guess ?");
  expect(spyableFunction).toBeCalledWith("defined, i guess ?");
})	
