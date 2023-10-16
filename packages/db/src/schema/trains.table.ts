import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { routes } from "./routes.table.js";

export const trains = pgTable("trains", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: varchar("name").notNull(),
	totalSeats: integer("total_seats").notNull(),
	carriageCapacity: integer("carriage_capacity").notNull(),
	premiumCarriages: integer("premium_carriages").notNull().default(0),
});

export type TrainsTable = typeof trains;

export type Train = InferSelectModel<TrainsTable>;

export const trainsRelations = relations(trains, ({ many }) => {
	return {
		routes: many(routes),
	};
});
