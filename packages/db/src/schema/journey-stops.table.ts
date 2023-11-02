import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { journeys } from "./journeys.table.js";
import { stops } from "./stops.table.js";
import { platforms } from "./platforms.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";

export const journeyStops = pgTable("journey_stops", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	expectedArrival: timestamp("expected_arrival").notNull(),
	actualArrival: timestamp("actual_arrival"),
	journeyId: uuid("journey_id")
		.notNull()
		.references(() => journeys.id),
	stopId: uuid("stop_id")
		.notNull()
		.references(() => stops.id),
	platformId: uuid("platform_id").references(() => platforms.id),
});

export type JourneyStopsTable = typeof journeyStops;

export type JourneyStop = InferSelectModel<JourneyStopsTable>;

export const journeyStopsRelations = relations(journeyStops, ({ one, many }) => {
	return {
		journey: one(journeys, {
			fields: [journeyStops.journeyId],
			references: [journeys.id],
		}),
		stop: one(stops, {
			fields: [journeyStops.stopId],
			references: [stops.id],
		}),
		platform: one(platforms, {
			fields: [journeyStops.platformId],
			references: [platforms.id],
		}),
	};
});
