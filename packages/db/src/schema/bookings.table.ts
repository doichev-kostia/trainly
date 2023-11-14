import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { bookingStatusEnum } from "./enums.js";
import { customers } from "./customers.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { tickets } from "./tickets.table.js";

export const bookings = pgTable("bookings", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	status: bookingStatusEnum("status").notNull(),
	customerId: uuid("customer_id").references(() => customers.id),
	email: varchar("email").notNull(),
});

export type BookingsTable = typeof bookings;

export type Booking = InferSelectModel<BookingsTable>;

export const bookingsRelations = relations(bookings, ({ one, many }) => {
	return {
		customer: one(customers, {
			fields: [bookings.customerId],
			references: [customers.id],
		}),
		tickets: many(tickets),
	};
});
