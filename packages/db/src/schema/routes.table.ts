import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { trains } from "./trains.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { journeys } from "./journeys.table.js";
import { stops } from "./stops.table.js";

export const routes = pgTable("routes", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: varchar("name").notNull(),
	pricing: jsonb("pricing").notNull(),
	trainId: uuid("train_id")
		.notNull()
		.references(() => trains.id),
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
