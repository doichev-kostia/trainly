import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { routes } from "./routes.table.js";
import { platforms } from "./platforms.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { journeyStops } from "./journey-stops.table.js";

export const stops = pgTable("stops", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	durationFromPrevious: integer("duration_from_previous").notNull(),
	routeId: uuid("route_id")
		.notNull()
		.references(() => routes.id),
	platformId: uuid("platform_id")
		.notNull()
		.references(() => platforms.id),
	nextStopId: uuid("next_stop_id"), // self-referencing
});

export type StopsTable = typeof stops;

export type Stop = InferSelectModel<StopsTable>;

export const stopsRelations = relations(stops, ({ one, many }) => {
	return {
		route: one(routes, {
			fields: [stops.routeId],
			references: [routes.id],
		}),
		platform: one(platforms, {
			fields: [stops.platformId],
			references: [platforms.id],
		}),
		nextStop: one(stops, {
			fields: [stops.nextStopId],
			references: [stops.id],
		}),
		routeStartStop: one(stops, {
			fields: [routes.startStopId as any],
			references: [stops.id],
		}),
		routeEndStop: one(stops, {
			fields: [routes.endStopId as any],
			references: [stops.id],
		}),
		journeyStop: one(journeyStops, {
			fields: [stops.id],
			references: [journeyStops.stopId],
		}),
	};
});
