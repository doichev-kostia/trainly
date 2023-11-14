import { type Journey, journeys } from "@trainly/db/schema/journeys";
import { type Route, routes } from "@trainly/db/schema/routes";
import { type JourneyStop } from "@trainly/db/schema/journey-stops";
import { type Seat, seats } from "@trainly/db/schema/seats";
import { type ListResponse } from "@trainly/contracts";
import { BaseRepository } from "#base-repository";
import { and, db, eq, gt, gte, inArray, sql } from "@trainly/db";
import { stops } from "@trainly/db/schema/stops";
import { stations } from "@trainly/db/schema/stations";
import { platforms } from "@trainly/db/schema/platforms";
import { relations } from "~/utils/db.js";

type RetrievedJourney = Journey & {
	route?: Route;
	stops?: JourneyStop[];
	seats?: Seat[];
};

type ListParams = {
	limit?: number;
	offset?: number;
	expand?: string[];
};

export class JourneyRepository {
	private static instance: JourneyRepository | undefined;

	private base: BaseRepository<typeof journeys, typeof db>;

	private constructor(database: typeof db, table: typeof journeys) {
		this.base = new BaseRepository(table, database);
	}

	public static getInstance() {
		if (!JourneyRepository.instance) {
			JourneyRepository.instance = new JourneyRepository(db, journeys);
		}

		return JourneyRepository.instance;
	}

	public async listAvailable(
		departureCity: string,
		arrivalCity: string,
		departureDate: Date,
		minSeats: number,
		params?: ListParams,
	): Promise<ListResponse<RetrievedJourney>> {
		const { table } = this.base;
		const { limit, offset, expand = [] } = params ?? {};

		const departure = db.$with("departure").as(
			db
				.select({
					stopOrder: stops.order,
					routeId: routes.id,
				})
				.from(stations)
				.innerJoin(platforms, eq(platforms.stationId, stations.id))
				.innerJoin(stops, eq(stops.platformId, platforms.id))
				.innerJoin(routes, eq(routes.id, stops.routeId))
				.where(eq(stations.name, departureCity)),
		);

		const arrival = db.$with("arrival").as(
			db
				.with(departure)
				.select({
					routeId: routes.id,
				})
				.from(stations)
				.innerJoin(platforms, eq(platforms.stationId, stations.id))
				.innerJoin(stops, eq(stops.platformId, platforms.id))
				.innerJoin(routes, eq(routes.id, stops.routeId))
				.innerJoin(departure, eq(departure.routeId, routes.id))
				.where(and(eq(stations.name, arrivalCity), gt(stops.order, departure.stopOrder))),
		);

		const journeys = await db
			.with(arrival)
			.select({
				id: table.id,
			})
			.from(table)
			.innerJoin(routes, eq(table.routeId, routes.id))
			.innerJoin(arrival, eq(arrival.routeId, routes.id))
			.innerJoin(seats, eq(table.id, seats.journeyId))
			.where(gte(table.departureTime, departureDate))
			.groupBy(table.id)
			.having(sql`COUNT(${seats.id}) >= ${minSeats}`);

		const journeyIds = journeys.map((j) => j.id);

		if (journeyIds.length === 0) {
			return {
				items: [],
				count: 0,
			};
		}

		const data = await db.query.journeys.findMany({
			where: inArray(table.id, journeyIds),
			with: relations(expand),
			limit,
			offset,
			orderBy: table.departureTime,
		});

		return {
			items: data,
			count: journeyIds.length,
		};
	}

	public retrieve(id: string, expand?: string[]): Promise<RetrievedJourney | undefined> {
		return this.base.retrieve(id, expand);
	}
}
