import { eq, ilike, type InferInsertModel, sql } from "@trainly/db";
import { type Address } from "@trainly/db/schema/addresses";
import { type Station, stations, type StationsTable } from "@trainly/db/schema/stations";
import assert from "node:assert";
import { type Platform } from "@trainly/db/schema/platforms";
import { type ListResponse } from "@trainly/contracts";
import { type ListStationQuery } from "@trainly/contracts/stations";
import { relations, stripValues } from "~/utils/db.js";
import { db } from "~/configs/db.js";

type CreateStationValues = Omit<InferInsertModel<StationsTable>, "id" | "createdAt" | "updatedAt">;

type RetrievedStation = Station & {
	address?: Address;
	platforms?: Platform[];
};

export class StationRepository {
	private static instance: StationRepository | undefined;

	public static getInstance() {
		if (!StationRepository.instance) {
			StationRepository.instance = new StationRepository();
		}

		return StationRepository.instance;
	}

	public async create(values: CreateStationValues): Promise<Station> {
		const data = {
			...values,
			updatedAt: new Date(),
		} satisfies InferInsertModel<StationsTable>;

		const [result] = await db.insert(stations).values(data).returning();

		assert.ok(result, "Failed to create station");

		return result;
	}

	public async list(params?: ListStationQuery): Promise<ListResponse<RetrievedStation>> {
		const { name, expand = [], offset, limit } = params ?? {};

		const relations: Record<string, true | undefined> = {
			address: undefined,
			platforms: undefined,
		};

		for (const relation of expand) {
			if (relation === "address") {
				relations.address = true;
			} else if (relation === "platforms") {
				relations.platforms = true;
			}
		}

		const condition = name ? ilike(stations.name, `%${name}%`) : undefined;

		const data = await db.query.stations.findMany({
			with: relations,
			where: condition,
			offset,
			limit,
		});

		const rows = await db
			.select({ count: sql<number>`count(*)` })
			.from(stations)
			.where(ilike(stations.name, `%${name}%`))
			.limit(1);

		const res = rows[0];
		assert.ok(res, "Failed to count stations");

		return {
			items: data,
			count: Number(res.count),
		};
	}

	public async retrieve(id: string, expansion: string[] = []): Promise<RetrievedStation | undefined> {
		const data = await db.query.stations.findFirst({
			with: relations(expansion),
			where: eq(stations.id, id),
		});

		return data;
	}

	public async update(id: string, values: Partial<CreateStationValues>): Promise<Station> {
		const data = stripValues(values) as InferInsertModel<StationsTable>;

		data.updatedAt = new Date();

		const [result] = await db.update(stations).set(data).where(eq(stations.id, id)).returning();

		assert.ok(result, "Failed to update station");

		return result;
	}

	public async del(id: string): Promise<{ affectedRows: number }> {
		const result = await db.delete(stations).where(eq(stations.id, id));

		return {
			affectedRows: result.length,
		};
	}
}
