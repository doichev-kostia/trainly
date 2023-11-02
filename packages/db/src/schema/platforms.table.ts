import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { stations } from "./stations.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { stops } from "./stops.table.js";
import { journeyStops } from "./journey-stops.table.js";

export const platforms = pgTable("platforms", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	name: varchar("name").notNull(),
	stationId: uuid("station_id")
		.notNull()
		.references(() => stations.id),
});

export type PlatformsTable = typeof platforms;

export type Platform = InferSelectModel<PlatformsTable>;

export const platformsRelations = relations(platforms, ({ one, many }) => {
	return {
		station: one(stations, {
			fields: [platforms.stationId],
			references: [stations.id],
		}),
		stops: many(stops),
		journeyStops: many(journeyStops),
	};
});
