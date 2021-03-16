"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildValidationArgumentsFromObject = exports.buildModelColumnArgumentsFromObject = void 0;
const pascalcase = require("pascalcase");
const types_1 = require("../../enums/types");
function buildModelColumnArgumentsFromObject(dbColumnaData) {
    const columnArgument = {};
    columnArgument.type = dbColumnaData.type;
    if (dbColumnaData.default !== undefined && dbColumnaData.default !== "") {
        if (dbColumnaData.isNullable !== true && dbColumnaData.default !== null) {
            columnArgument.default = dbColumnaData.default;
            /*} else if (dbColumnaData.date) {
            columnArgument.default = dbColumnaData.date;
        } else if (dbColumnaData.time) {
            columnArgument.default = dbColumnaData.time;*/
        }
        else if (dbColumnaData.now) {
            switch (dbColumnaData.type) {
                case "datetime":
                case "timestamp":
                    columnArgument.default = () => "CURRENT_TIMESTAMP";
                    break;
                /* WIP: find a way to default current date, time and year without
                making the alteration of the impossible.
                case "time":
                    columnArgument.default = () => "(TIME(CURRENT_TIMESTAMP))";
                    break;
                case "date":
                    columnArgument.default = () => "(DATE(CURRENT_TIMESTAMP))";
                    break;
                case "year":
                    columnArgument.default = () => "(YEAR(CURRENT_TIMESTAMP))";
                    break;*/
            }
        }
    }
    if (dbColumnaData.type.includes("int")) {
        if (dbColumnaData.length) {
            throw new Error("Length must not be used with int types , use width instead");
        }
    }
    if (dbColumnaData.scale) {
        columnArgument.scale = dbColumnaData.scale;
    }
    if (dbColumnaData.precision) {
        columnArgument.precision = dbColumnaData.precision;
    }
    if (dbColumnaData.enums) {
        columnArgument.enum = pascalcase(dbColumnaData.name);
    }
    // handle nullable
    if (!dbColumnaData.isUnique && !dbColumnaData.isPrimary) {
        columnArgument.nullable ?? (columnArgument.nullable = dbColumnaData.isNullable);
    }
    else if (dbColumnaData.isUnique) {
        columnArgument.unique = true;
    }
    else if (dbColumnaData.isPrimary) {
        columnArgument.primary = true;
    }
    if (dbColumnaData.length) {
        columnArgument.length = dbColumnaData.length;
    }
    if (dbColumnaData.width) {
        columnArgument.width = dbColumnaData.width;
    }
    return columnArgument;
}
exports.buildModelColumnArgumentsFromObject = buildModelColumnArgumentsFromObject;
function buildValidationArgumentsFromObject(dbColumnaData) {
    const validationArguments = {};
    if (!dbColumnaData.isNullable) {
        validationArguments["exists"] = true;
    }
    else {
        validationArguments["optional"] = {
            options: {
                nullable: true,
                checkFalsy: true,
            },
        };
    }
    if (dbColumnaData.length) {
        validationArguments["isLength"] = {
            errorMessage: `Maximum length is ${dbColumnaData.length}`,
            options: { min: 0, max: dbColumnaData.length },
        };
    }
    if (["email", "mail"].includes(dbColumnaData.name)) {
        validationArguments["isEmail"] = {
            errorMessage: "Email is not valid",
        };
    }
    if (types_1.arrayOfString.includes(dbColumnaData.type)) {
        validationArguments["isString"] = {
            errorMessage: "This field must be a string",
        };
    }
    if (["decimal", "dec"].includes(dbColumnaData.type)) {
        validationArguments["isDecimal"] = {
            errorMessage: "This field must be decimal",
        };
    }
    if (dbColumnaData.type === "float") {
        validationArguments["isFloat"] = {
            errorMessage: "This field must be a float",
        };
    }
    if (types_1.arrayOfInt.includes(dbColumnaData.type)) {
        validationArguments["isInt"] = {
            errorMessage: "This field must be an integer",
        };
    }
    if (dbColumnaData.type.includes("time")) {
        validationArguments["isISO8601"] = true;
    }
    else if (dbColumnaData.type.includes("date")) {
        validationArguments["isDate"] = true;
    }
    if (dbColumnaData.type === "enum") {
        validationArguments["isIn"] = {
            options: [`Object.values(${pascalcase(dbColumnaData.name)})`],
            errorMessage: "Invalid enum",
        };
    }
    return validationArguments;
}
exports.buildValidationArgumentsFromObject = buildValidationArgumentsFromObject;
