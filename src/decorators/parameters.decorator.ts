import { BaseController, Constructor } from "..";
import { getMetadataStorage } from "../metadata/metadata-storage";

export function Body() {
    return function(target: Constructor<BaseController>, methodName: string, parameterIndex: number) {
        getMetadataStorage().useParams.push({
            target,
            property: methodName,
            parameterIndex,
            type: "body"
        })
    }
}


export function Request() {
    return function(target: Constructor<BaseController>, methodName: string, parameterIndex: number) {
        getMetadataStorage().useParams.push({
            target,
            property: methodName,
            parameterIndex,
            type: "request"
        })
    }
}

export function Param(paramName: string) {
    return function(target: Constructor<BaseController>, methodName: string, parameterIndex: number) {
        getMetadataStorage().useParams.push({
            target,
            property: methodName,
            parameterIndex,
            type: "param",
            args: [paramName]
        })
    }
}