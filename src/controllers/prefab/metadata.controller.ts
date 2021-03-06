/* eslint-disable arrow-body-style */
import { Request, Response } from "express";
import { singleton } from "tsyringe";
import { EntityMetadata, getRepository } from "typeorm";
import { ApplicationRegistry } from "../../application/registry.application";
import { Controller, Get } from "../../decorators/controller.decorator";
import { TypeORMService } from "../../services/typeorm.service";
import { BaseController } from "../base.controller";
import { getPerms } from "../../generator/commands/get-perms";
import { getRoles } from "../../generator/commands/get-roles";
import { getEntityRoutes } from "../../generator/commands/get-entityRoutes";
import * as pluralize from "pluralize";

/**
 * Use or inherit this controller in your app if you want to get api metadata
 */
@Controller("meta")
@singleton()
export class MetadataController extends BaseController {
	public constructor(private typeormConnection: TypeORMService) {
		super();
	}

	@Get("/routes")
	public getAllRoutes() {
		return ApplicationRegistry.application.Routes;
	}

	@Get("/routes/:name")
	public getEntityRoutes(req: Request, res: Response) {
		const allRoutes = ApplicationRegistry.application.Routes;

		const entityRoutes = this.getRoutes(allRoutes, req.params.name);

		return getEntityRoutes(req.params.name, entityRoutes);
	}

	@Get("/types")
	public getSupportedTypes() {
		const connection = this.typeormConnection.connection;

		return connection.driver.supportedDataTypes;
	}

	@Get("/count")
	public async countAllEntitiesRecords() {
		return Promise.all(
			this.getJsonApiEntities().map(async (entity) => {
				return {
					entityName: entity.name,
					count: await getRepository(entity.target).count(),
				};
			})
		);
	}

	@Get("/roles")
	public getRoles(req: Request, res: Response) {
		return getRoles();
	}

	@Get("/perms/:name")
	public getPerms(req: Request, res: Response) {
		return getPerms(req.params.name);
	}

	@Get("/:entity/count")
	public async countEntityRecords(req: Request, res: Response) {
		const { entity } = req.params;
		const entityTarget = this.findEntityMetadataByName(entity);
		return {
			count: await getRepository(entityTarget.target).count(),
		};
	}

	@Get("/:entity")
	public getEntityMeta(req: Request, res: Response) {
		return this.entityMetadaBuilder(
			this.findEntityMetadataByName(req.params.entity)
		);
	}

	@Get("/")
	public getEntities(req: Request, res: Response) {
		return this.getJsonApiEntities().map((table) =>
			this.entityMetadaBuilder(table)
		);
	}

	protected getJsonApiEntities() {
		return this.typeormConnection.connection.entityMetadatas.filter((table) =>
			ApplicationRegistry.entities.includes(table.target as any)
		);
	}

	protected findEntityMetadataByName(name: string) {
		const result = this.getJsonApiEntities().filter(
			(table) => table.name.toLowerCase() === name.toLowerCase()
		);
		return result.length ? result[0] : null;
	}

	protected entityMetadaBuilder(table: EntityMetadata) {
		return {
			id: table.name,
			entityName: table.name,
			table: table.tableName,
			columns: table.ownColumns
				.filter((c) => !c.relationMetadata)
				.map((column) => {
					return {
						property: column.propertyName,
						type: this.typeormConnection.connection.driver.normalizeType(
							column
						),
						default: this.typeormConnection.connection.driver.normalizeDefault(
							column
						),
						width: column.width,
						length: column.length,
						isPrimary: column.isPrimary,
						isNullable: column.isNullable,
						enumValues: column.enum,
					};
				}),
			relations: table.ownRelations.map((rel) => {
				return {
					propertyName: rel.propertyName,
					inverseEntityName: rel.inverseEntityMetadata.name,
					inversePropertyName: rel.inverseRelation.propertyName,
					relationType: rel.relationType,
					isNullable: rel.isNullable,
				};
			}),
		};
	}

	protected getRoutes(routes: any, entity: string) {
		for (const route of routes) {
			if (route.prefix === entity) return route.routes;
		}
		return null;
	}
}
