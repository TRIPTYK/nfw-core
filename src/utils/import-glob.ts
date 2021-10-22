import {promise} from "glob-promise";

export async function importGlob(pattern: string) {
    const files = await promise(pattern);
    return Promise.all(files.map((file) => import(file.includes(".") ? file.split(".").slice(0,-1).join(".") : file)));
}