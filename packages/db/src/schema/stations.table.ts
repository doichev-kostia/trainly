import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { addresses } from "./addresses.table.js";
import { platforms } from "./platforms.table.js";

export const stations = pgTable("stations", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: varchar("name").notNull(),
});

export type StationsTable = typeof stations;

export type Station = InferSelectModel<StationsTable>;

export const stationsRelations = relations(stations, ({ one, many }) => {
	return {
		address: one(addresses, {
			fields: [stations.id],
			references: [addresses.stationId],
		}),
		platforms: many(platforms),
	};
});
