"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportedTypes = void 0;
async function getSupportedTypes() {
    return [
        // numeric types
        "bit",
        "int",
        "integer",
        "tinyint",
        "smallint",
        "mediumint",
        "bigint",
        "float",
        "double",
        "double precision",
        "real",
        "decimal",
        "dec",
        "numeric",
        "fixed",
        "bool",
        "boolean",
        // date and time types
        "date",
        "datetime",
        "timestamp",
        "time",
        "year",
        // string types
        "char",
        "nchar",
        "national char",
        "varchar",
        "nvarchar",
        "national varchar",
        "blob",
        "text",
        "tinyblob",
        "tinytext",
        "mediumblob",
        "mediumtext",
        "longblob",
        "longtext",
        "enum",
        "set",
        "binary",
        "varbinary",
        // json data type
        "json",
        // spatial data types
        "geometry",
        "point",
        "linestring",
        "polygon",
        "multipoint",
        "multilinestring",
        "multipolygon",
        "geometrycollection",
    ];
}
exports.getSupportedTypes = getSupportedTypes;
