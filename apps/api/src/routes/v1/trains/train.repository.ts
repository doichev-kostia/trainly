import { db, type InferInsertModel, sql, eq } from "@trainly/db";
import { type Train, trains, type TrainsTable } from "@trainly/db/schema/trains";
import assert from "node:assert";
import { type ListResponse, type PaginationQuery } from "@trainly/contracts";
import { stripValues } from "~/utils/db.js";

type CreateTrainValues = Omit<InferInsertModel<TrainsTable>, "id" | "createdAt" | "updatedAt">;

export class TrainRepository {
	private static instance: TrainRepository | undefined;

	public static getInstance() {
		if (!TrainRepository.instance) {
			TrainRepository.instance = new TrainRepository();
		}

		return TrainRepository.instance;
	}

	public async createTrain(values: CreateTrainValues): Promise<Train> {
		const data = {
			...values,
			updatedAt: new Date(),
		} satisfies InferInsertModel<TrainsTable>;

		const [result] = await db.insert(trains).values(data).returning();

		assert.ok(result, "Failed to create a train");

		return result;
	}

	public async listTrains(params: PaginationQuery): Promise<ListResponse<Train>> {
		const { limit, offset } = params ?? {};

		const data = await db.query.trains.findMany({
			offset,
			limit,
		});

		const rows = await db
			.select({
				count: sql<number>`count(*)`,
			})
			.from(trains)
			.limit(1);

		const res = rows[0];
		assert.ok(res, "Failed to count trains");

		return {
			items: data,
			count: res.count,
		};
	}

	public async retrieveTrain(id: string): Promise<Train | undefined> {
		const data = await db.query.trains.findFirst({
			where: eq(trains.id, id),
		});

		return data;
	}

	public async updateTrain(
		id: string,
		values: Partial<CreateTrainValues>,
	): Promise<Train | undefined> {
		const data = stripValues(values) as InferInsertModel<TrainsTable>;

		data.updatedAt = new Date();

		const [result] = await db.update(trains).set(data).where(eq(trains.id, id)).returning();

		assert.ok(result, "Failed to update train");

		return result;
	}

	public async deleteTrain(id: string): Promise<{ affectedRows: number }> {
		const result = await db.delete(trains).where(eq(trains.id, id));

		assert.ok(result, "Failed to delete train");

		return {
			affectedRows: result.length,
		};
	}
}
