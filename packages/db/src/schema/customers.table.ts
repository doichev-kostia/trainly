import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, relations } from "drizzle-orm";
import { bookings } from "./bookings.table.js";

export const customers = pgTable("customers", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("create_at").notNull().defaultNow(),
	updatedAt: timestamp("update_at").notNull().defaultNow(),
	firstName: varchar("first_name").notNull(),
	lastName: varchar("last_name").notNull(),
	email: varchar("email").notNull(),
});

export type CustomersTable = typeof customers;

export type Customer = InferSelectModel<CustomersTable>;

export const customersRelations = relations(customers, ({ one, many }) => {
	return {
		bookings: many(bookings),
	};
});
