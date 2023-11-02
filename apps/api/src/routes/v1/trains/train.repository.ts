import { db, type InferInsertModel } from "@trainly/db";
import { type Train, trains, type TrainsTable } from "@trainly/db/schema/trains";
import { type ListResponse } from "@trainly/contracts";
import { type ListOptions } from "~/utils/db.js";
import { BaseRepository } from "#base-repository";
import { InternalError } from "~/errors/domain/InternalError.js";

type CreateTrainValues = Omit<InferInsertModel<TrainsTable>, "id" | "createdAt" | "updatedAt">;

export class TrainRepository {
	private static instance: TrainRepository | undefined;
	private base: BaseRepository<typeof trains, typeof db>;

	private constructor(database: typeof db, table: typeof trains) {
		this.base = new BaseRepository(table, database);
	}

	public static getInstance() {
		if (!TrainRepository.instance) {
			TrainRepository.instance = new TrainRepository(db, trains);
		}

		return TrainRepository.instance;
	}

	public async create(values: CreateTrainValues): Promise<Train> {
		const result = await this.base.create(values);

		if (!result) {
			throw new InternalError("Failed to create train");
		}

		return result;
	}

	public async list(params: ListOptions = {}): Promise<ListResponse<Train>> {
		const trains = await this.base.list(params);
		const count = await this.base.count();

		if (!count) {
			throw new InternalError("Failed to count trains");
		}

		return {
			items: trains,
			count: count,
		};
	}

	public async retrieve(id: string): Promise<Train | undefined> {
		const data = await this.base.retrieve(id);

		return data;
	}

	public async update(id: string, values: Partial<CreateTrainValues>): Promise<Train> {
		const result = await this.base.update(id, values);

		if (!result) {
			throw new InternalError("Failed to update train");
		}

		return result;
	}

	public async del(id: string): Promise<{ affectedRows: number }> {
		const result = await this.base.del(id);

		return result;
	}
}
