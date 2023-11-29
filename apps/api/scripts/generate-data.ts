import { type Train } from "@trainly/db/build/schema/trains.table";
import { randomUUID } from "node:crypto";
import { faker } from "@faker-js/faker";
import { type Station } from "@trainly/db/build/schema/stations.table";
import { type Address } from "@trainly/db/build/schema/addresses.table";
import { type Platform } from "@trainly/db/build/schema/platforms.table";
import { type Route } from "@trainly/db/build/schema/routes.table";
import { type Stop } from "@trainly/db/build/schema/stops.table";
import { type Journey } from "@trainly/db/build/schema/journeys.table";
import { type JourneyStop } from "@trainly/db/build/schema/journey-stops.table";
import { type Seat } from "@trainly/db/build/schema/seats.table";
import { seatClass, seatStatus } from "@trainly/db/build/schema/enums";
import assert from "node:assert";
import process from "node:process";
import * as path from "path";
import * as fs from "fs";
import { SeatClass } from "@trainly/contracts/build/seats";

const SEATS_PER_TRAIN = 20;
const CARRIAGE_CAPACITY = 10;
const PREMIUM_CARRIAGES = 1;
const NUMBER_OF_TRAINS = 3;
const STOPS_PER_ROUTE = 3;
const JOURNEYS_PER_ROUTE = 3;

function createTrain(): Train {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		name: faker.vehicle.vehicle(),
		totalSeats: SEATS_PER_TRAIN,
		carriageCapacity: CARRIAGE_CAPACITY,
		premiumCarriages: PREMIUM_CARRIAGES,
	};
}

function createStation(): Station {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		name: faker.location.city(),
	};
}

function createAddress(stationId: string): Address {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		country: faker.location.country(),
		city: faker.location.city(),
		line1: faker.location.streetAddress(),
		line2: null,
		postalCode: faker.location.zipCode(),
		state: null,
		stationId,
	};
}

function createPlatform(stationId: string): Platform {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		name: faker.number.int({ min: 1, max: 10 }).toString(),
		stationId,
	};
}

function createRoute(trainId: string): Route {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		name: `${faker.location.city()} - ${faker.location.city()}`,
		pricing: {
			[SeatClass.standard]: process.env.STANDARD_PRICE,
			[SeatClass.premium]: process.env.PREMIUM_PRICE,
		},
		trainId,
	};
}

function createStop(routeId: string, platformId: string, order: number): Stop {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		durationFromPrevious: faker.number.int({ min: 300, max: 3600 }),
		routeId,
		platformId,
		order,
	};
}

function createJourney(routeId: string): Journey {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		departureTime: faker.date.soon({
			days: 1,
			refDate: new Date(),
		}),
		delay: 0,
		routeId,
	};
}

function createJourneyStop(
	stopId: string,
	journeyId: string,
	expectedArrival: Date,
	platformId: string | null,
): JourneyStop {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		expectedArrival,
		actualArrival: null,
		stopId,
		journeyId,
		platformId,
	};
}

function createSeat(journeyId: string, num: number): Seat {
	return {
		id: randomUUID(),
		createdAt: new Date(),
		updatedAt: new Date(),
		number: num,
		class: num < PREMIUM_CARRIAGES * CARRIAGE_CAPACITY ? seatClass.premium : seatClass.standard,
		status: seatStatus.available,
		journeyId,
	};
}

function getRandomElement<T>(array: T[]): T {
	return array[faker.number.int({ min: 0, max: array.length - 1 })];
}

function generateData() {
	const trains = Array.from({ length: NUMBER_OF_TRAINS }, createTrain);
	console.log(`Generated ${trains.length} trains`);
	const stations = Array.from({ length: NUMBER_OF_TRAINS }, createStation);
	console.log(`Generated ${stations.length} stations`);
	const addresses = stations.map((station) => createAddress(station.id));
	console.log(`Generated ${addresses.length} addresses`);
	const platforms = stations.map((station) => createPlatform(station.id));
	console.log(`Generated ${platforms.length} platforms`);
	const routes = trains.map((train) => createRoute(train.id));
	console.log(`Generated ${routes.length} routes`);

	const stopMap = new Map<string, Stop[]>();

	console.log(`Generating stops`);
	const loggingFrequency = Math.floor(routes.length / 2);
	for (let i = 0; i < routes.length; i += 1) {
		if (i % loggingFrequency === 0) {
			console.log(`Generating ${i + 1} stop`);
		}
		const route = routes[i];
		assert(route);
		const stop1 = createStop(route.id, getRandomElement(platforms).id, 0);
		const stop2 = createStop(route.id, getRandomElement(platforms).id, 1);
		const stop3 = createStop(route.id, getRandomElement(platforms).id, 2);

		const stops = [stop1, stop2, stop3];
		assert.equal(stops.length, STOPS_PER_ROUTE);

		stopMap.set(route.id, stops);
	}
	console.log(`Generated stops for ${routes.length} routes`);

	const journeyQuantity = routes.length * JOURNEYS_PER_ROUTE;
	const journeyStopQuantity = journeyQuantity * STOPS_PER_ROUTE;
	const seatQuantity = journeyQuantity * SEATS_PER_TRAIN;

	const journeys: Journey[] = new Array(journeyQuantity);
	let journeyPtr = 0;
	const journeyStops: JourneyStop[] = new Array(journeyStopQuantity);
	let journeyStopPtr = 0;
	const seats: Seat[] = new Array(seatQuantity);
	let seatPtr = 0;

	console.log(`Initialized journey arrays`);

	console.log(`Generating journeys`);
	for (let routeIdx = 0; routeIdx < routes.length; routeIdx += 1) {
		const shouldLog = routeIdx % loggingFrequency === 0;
		if (shouldLog) {
			console.log(`Generating journeys for ${routeIdx + 1} route`);
		}
		const route = routes[routeIdx];
		const stops = stopMap.get(route.id);
		assert(stops);
		const routeJourneys = Array.from({ length: JOURNEYS_PER_ROUTE }, () => createJourney(route.id));
		const routeJourneyStopsMap = new Map<string, JourneyStop[]>();

		if (shouldLog) {
			console.log(`Generating journey stops for ${routeIdx + 1} route`);
		}
		for (let journeyIdx = 0; journeyIdx < routeJourneys.length; journeyIdx += 1) {
			const journey = routeJourneys[journeyIdx];

			// seconds
			let stopsDuration = 0;
			for (let stopIdx = 0; stopIdx < stops.length; stopIdx += 1) {
				const stop = stops[stopIdx];
				stopsDuration += stop.durationFromPrevious;
				const expectedArrival = journey.departureTime.getTime() + stopsDuration * 1000;
				const journeyStop = createJourneyStop(stop.id, journey.id, new Date(expectedArrival), stop.platformId);

				const array = routeJourneyStopsMap.get(journey.id);
				if (array) {
					array.push(journeyStop);
				} else {
					routeJourneyStopsMap.set(journey.id, [journeyStop]);
				}
			}

			if (shouldLog) {
				console.log(`Generating seats for ${routeIdx + 1} route`);
			}

			for (let seatIdx = 0; seatIdx < SEATS_PER_TRAIN; seatIdx += 1) {
				if (shouldLog && seatIdx % 20 === 0) {
					console.log(`Generating ${seatIdx + 1} seat`);
				}
				seats[seatPtr] = createSeat(journey.id, seatIdx);
				seatPtr += 1;
			}
		}

		for (let i = 0; i < routeJourneys.length; i += 1) {
			journeys[journeyPtr] = routeJourneys[i];
			journeyPtr += 1;
		}

		const journeyStopsArray = Array.from(routeJourneyStopsMap.values()).flat();
		for (let i = 0; i < journeyStopsArray.length; i += 1) {
			journeyStops[journeyStopPtr] = journeyStopsArray[i];
			journeyStopPtr += 1;
		}
	}

	const stops = Array.from(stopMap.values()).flat();

	return {
		trains,
		stations,
		addresses,
		platforms,
		routes,
		stops,
		journeys,
		journeyStops,
		seats,
	};
}

function normalizeData(record: Record<string, unknown>) {
	const rec = { ...record };

	for (const key in rec) {
		const value = rec[key];
		if (value === null) {
			rec[key] = "\\N";
		} else if (typeof value === "object" && value instanceof Date) {
			rec[key] = value.toISOString();
		} else if (typeof value === "object" && value instanceof Array) {
			rec[key] = `{${value.join(",")}}`;
		} else if (typeof value === "object" && value instanceof Object) {
			rec[key] = JSON.stringify(value);
		}
	}

	return rec;
}

function sqlLog(str: string) {
	return `
DO $$
BEGIN
	RAISE NOTICE '${str}';
END $$;
`;
}

async function main() {
	const { trains, stations, addresses, platforms, routes, stops, journeys, journeyStops, seats } = generateData();

	const filepath = path.resolve(process.cwd(), "data.sql");

	console.log(`Writing to ${filepath}`);

	/* prettier-ignore */
	const sql = `
start transaction;
COPY trains ("id", "created_at", "updated_at", "name", "total_seats", "carriage_capacity", "premium_carriages") FROM stdin;
${trains.map(normalizeData).map((train) => `${train.id}\t${train.createdAt}\t${train.updatedAt}\t${train.name}\t${train.totalSeats}\t${train.carriageCapacity}\t${train.premiumCarriages}`).join("\n")}
\\.

${sqlLog("Trains imported")}

COPY stations ("id", "created_at", "updated_at", "name") FROM stdin;
${stations.map(normalizeData).map((station) => `${station.id}\t${station.createdAt}\t${station.updatedAt}\t${station.name}`).join("\n")}
\\.

${sqlLog("Stations imported")}

COPY addresses ("id", "created_at", "updated_at", "country", "city", "line1", "line2", "postal_code", "state", "station_id") FROM stdin;
${addresses.map(normalizeData).map((address) => `${address.id}\t${address.createdAt}\t${address.updatedAt}\t${address.country}\t${address.city}\t${address.line1}\t${address.line2}\t${address.postalCode}\t${address.state}\t${address.stationId}`).join("\n")}
\\.

${sqlLog("Addresses imported")}

COPY platforms ("id", "created_at", "updated_at", "name", "station_id") FROM stdin;
${platforms.map(normalizeData).map((platform) => `${platform.id}\t${platform.createdAt}\t${platform.updatedAt}\t${platform.name}\t${platform.stationId}`).join("\n")}
\\.

${sqlLog("Platforms imported")}

COPY routes ("id", "created_at", "updated_at", "name", "pricing", "train_id") FROM stdin;
${routes.map(normalizeData).map((route) => `${route.id}\t${route.createdAt}\t${route.updatedAt}\t${route.name}\t${route.pricing}\t${route.trainId}`).join("\n")}
\\.

${sqlLog("Routes imported")}

COPY stops ("id", "created_at", "updated_at", "duration_from_previous", "route_id", "platform_id", "order") FROM stdin;
${stops.map(normalizeData).map((stop) => `${stop.id}\t${stop.createdAt}\t${stop.updatedAt}\t${stop.durationFromPrevious}\t${stop.routeId}\t${stop.platformId}\t${stop.order}`).join("\n")}
\\.

${sqlLog("Stops imported")}

COPY journeys ("id", "created_at", "updated_at", "departure_time", "route_id") FROM stdin;
${journeys.map(normalizeData).map((journey) => `${journey.id}\t${journey.createdAt}\t${journey.updatedAt}\t${journey.departureTime}\t${journey.routeId}`).join("\n")}
\\.

${sqlLog("Journeys imported")}

COPY journey_stops ("id", "created_at", "updated_at", "expected_arrival", "actual_arrival", "stop_id", "journey_id", "platform_id") FROM stdin;
${journeyStops.map(normalizeData).map((stop) => `${stop.id}\t${stop.createdAt}\t${stop.updatedAt}\t${stop.expectedArrival}\t${stop.actualArrival}\t${stop.stopId}\t${stop.journeyId}\t${stop.platformId}`).join("\n")}
\\.

${sqlLog("Journey stops imported")}

COPY seats ("id", "created_at", "updated_at", "number", "class", "journey_id") FROM stdin;
${seats.map(normalizeData).map((seat) => `${seat.id}\t${seat.createdAt}\t${seat.updatedAt}\t${seat.number}\t${seat.class}\t${seat.journeyId}`).join("\n")}
\\.

${sqlLog("Seats imported")}

commit;
`;
	/* prettier-ignore */

	await fs.promises.writeFile(filepath, sql);
}

main().catch((err) => {
	console.error(err);
	process.exit(69);
});
