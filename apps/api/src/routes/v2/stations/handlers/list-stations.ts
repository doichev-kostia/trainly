import { type Handler, type Instance } from "~/utils/types.js";
import { type ListStationsQuery, type ListStationsResponse } from "~/routes/v2/stations/schemas.js";
import { asc, eq, gt, sql } from "@trainly/db";
import { stations as stationsTable } from "@trainly/db/schema/stations";

type Schema = {
	querystring: ListStationsQuery;
	response: ListStationsResponse;
};

export function listStationsHandler(fastify: Instance): Handler<Schema> {
	return async function listStations(request, reply) {
		const { db } = fastify;

		const { pageSize, pageToken } = request.query;

		const p = pageToken ? decode(pageToken) : null;

		const condition = p ? gt(stationsTable.name, p.name) : undefined;

		const stations = await db.query.stations.findMany({
			with: {
				address: true,
			},
			where: condition,
			limit: pageSize,
			orderBy: [asc(stationsTable.name)],
		});

		const [count] = await db
			.select({
				count: sql<number>`COUNT(*)`,
			})
			.from(stationsTable)
			.where(condition ? eq(stationsTable.name, condition) : undefined)
			.execute();

		const last = stations.at(-1);
		const cursor = last
			? encode({
					name: last.name,
			  })
			: "";

		return {
			stations,
			nextPageToken: cursor,
		};
	};
}

type Cursor = {
	name: string;
};

const encode = (data: Cursor) => Buffer.from(new URLSearchParams(data).toString()).toString("base64");

const decode = (data: string) => {
	const params = new URLSearchParams(Buffer.from(data, "base64").toString());
	return {
		name: params.get("name")!,
	};
};
