import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { stations } from "./stations.table.js";

export const addresses = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	country: varchar("country").notNull(),
	city: varchar("city").notNull(),
	line1: varchar("line1").notNull(),
	line2: varchar("line2"),
	postalCode: varchar("postal_code").notNull(),
	state: varchar("state"),
	stationId: uuid("station_id")
		.notNull()
		.references(() => stations.id, {
			onDelete: "cascade",
		}),
});

export type AddressesTable = typeof addresses;

export type Address = InferSelectModel<AddressesTable>;
