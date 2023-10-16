import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel } from "drizzle-orm";
import { stations } from "./stations.table.js";

export const addresses = pgTable("addresses", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	country: varchar("country").notNull(),
	city: varchar("city").notNull(),
	street: varchar("street").notNull(),
	streetNumber: varchar("street_number").notNull(),
	index: varchar("index").notNull(),
	stationId: uuid("station_id")
		.notNull()
		.references(() => stations.id),
});

export type AddressesTable = typeof addresses;

export type Address = InferSelectModel<AddressesTable>;
