import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { routes } from "./routes.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { journeyStops } from "./journey-stops.table.js";
import { seats } from "./seats.table.js";

export const journeys = pgTable("journeys", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	departureTime: timestamp("departure_time").notNull(),
	delay: integer("delay").notNull().default(0), // seconds
	routeId: uuid("route_id")
		.notNull()
		.references(() => routes.id),
});

export type JourneysTable = typeof journeys;

export type Journey = InferSelectModel<JourneysTable>;

export const journeysRelations = relations(journeys, ({ one, many }) => {
	return {
		route: one(routes, {
			fields: [journeys.routeId],
			references: [routes.id],
		}),
		journeyStops: many(journeyStops),
		seats: many(seats),
	};
});
