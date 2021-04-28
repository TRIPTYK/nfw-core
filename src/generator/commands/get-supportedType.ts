import { getConnection } from "typeorm";
import { TypeORMService } from "../../services/typeorm.service";

export async function getSupportedTypes(): Promise<Array<String>> {
	return [
		// numeric types
		"bit",
		"int",
		"integer", // synonym for int
		"tinyint",
		"smallint",
		"mediumint",
		"bigint",
		"float",
		"double",
		"double precision", // synonym for double
		"real", // synonym for double
		"decimal",
		"dec", // synonym for decimal
		"numeric", // synonym for decimal
		"fixed", // synonym for decimal
		"bool", // synonym for tinyint
		"boolean", // synonym for tinyint
		// date and time types
		"date",
		"datetime",
		"timestamp",
		"time",
		"year",
		// string types
		"char",
		"nchar", // synonym for national char
		"national char",
		"varchar",
		"nvarchar", // synonym for national varchar
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
