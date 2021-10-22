import { getConnection } from "typeorm";
import { getMetadataStorage } from "../../metadata/metadata-storage";

export function getJsonApiEntityName(prefix: string) {
    return getConnection()
        .entityMetadatas.filter((table) =>
            getMetadataStorage().entities.includes(table.target as any)
        )
        .map((table) => {
            return {
                entityName: table.name,
                tableName: table.tableName
            };
        })
        .find((table) => table.tableName.toLowerCase() === prefix);
}
