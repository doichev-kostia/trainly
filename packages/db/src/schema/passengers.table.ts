import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { tickets } from "./tickets.table.js";

export const passengers = pgTable("passengers", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
});

export type PassengersTable = typeof passengers;

export type Passenger = InferSelectModel<PassengersTable>;

export const passengersRelations = relations(passengers, ({ one }) => {
	return {
		ticket: one(tickets, {
			fields: [passengers.id],
			references: [tickets.passengerId],
		}),
	};
});
