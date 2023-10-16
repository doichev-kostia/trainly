import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { trains } from "./trains.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { journeys } from "./journeys.table.js";
import { stops } from "./stops.table.js";

export const routes = pgTable("routes", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	name: varchar("name").notNull(),
	pricing: jsonb("pricing").notNull(),
	trainId: uuid("train_id")
		.notNull()
		.references(() => trains.id),
	startStopId: uuid("start_stop_id").notNull(), // Can't use references here because of circular dependency
	endStopId: uuid("end_stop_id").notNull(), // Can't use references here because of circular dependency
});

export type RoutesTable = typeof routes;

export type Route = InferSelectModel<RoutesTable>;

export const routesRelations = relations(routes, ({ one, many }) => {
	return {
		journeys: many(journeys),
		train: one(trains, {
			fields: [routes.trainId],
			references: [trains.id],
		}),
		stops: many(stops),
	};
});
