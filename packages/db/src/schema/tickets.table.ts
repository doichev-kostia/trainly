import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { passengers } from "./passengers.table.js";
import { seats } from "./seats.table.js";
import { bookings } from "./bookings.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";

export const tickets = pgTable("tickets", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updateAt: timestamp("updated_at").notNull().defaultNow(),
	passengerId: uuid("passenger_id")
		.notNull()
		.references(() => passengers.id),
	seatId: uuid("seat_id")
		.notNull()
		.references(() => seats.id),
	bookingId: uuid("booking_id")
		.notNull()
		.references(() => bookings.id),
});

export type TicketsTable = typeof tickets;

export type Ticket = InferSelectModel<TicketsTable>;

export const ticketsRelations = relations(tickets, ({ one, many }) => {
	return {
		booking: one(bookings, {
			fields: [tickets.bookingId],
			references: [bookings.id],
		}),
	};
});
