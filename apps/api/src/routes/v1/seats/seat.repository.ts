import { BaseRepository } from "#base-repository";
import { type Seat, seats } from "@trainly/db/schema/seats";
import { db, eq, inArray, sql } from "@trainly/db";
import { relations } from "~/utils/db.js";
import { InternalError } from "~/errors/domain/InternalError.js";
import { type Journey } from "@trainly/db/schema/journeys";
import { type Ticket } from "@trainly/db/schema/tickets";
import { type ListResponse } from "@trainly/contracts";
import { type SeatStatus } from "@trainly/db/schema/enums";

type ListParams = {
	limit?: number;
	offset?: number;
	expand?: string[];
};

type RetrievedSeat = Seat & {
	journey?: Journey;
	ticket?: Ticket;
};

export class SeatRepository {
	private static instance: SeatRepository | undefined;
	private base: BaseRepository<typeof seats, typeof db>;
	private constructor(database: typeof db, table: typeof seats) {
		this.base = new BaseRepository(table, database);
	}

	public static getInstance() {
		if (!SeatRepository.instance) {
			SeatRepository.instance = new SeatRepository(db, seats);
		}

		return SeatRepository.instance;
	}

	public async list(
		journeyId: string,
		params?: ListParams,
	): Promise<ListResponse<RetrievedSeat>> {
		const { limit, offset, expand = [] } = params ?? {};

		const data = await db.query.seats.findMany({
			where: eq(seats.journeyId, journeyId),
			with: relations(expand),
			limit,
			offset,
		});

		const rows = await db
			.select({
				count: sql<string>`count(*)`,
			})
			.from(seats)
			.where(eq(seats.journeyId, journeyId));

		const res = rows[0];
		if (!res) {
			throw new InternalError("Failed to count seats");
		}

		return {
			items: data,
			count: Number(res.count),
		};
	}

	public async updateStatus(ids: string[], status: SeatStatus): Promise<void> {
		await db.update(seats).set({ status }).where(inArray(seats.id, ids));
	}
}
