import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { seatClassEnum, seatStatus, seatStatusEnum } from "./enums.js";
import { journeys } from "./journeys.table.js";
import { type InferSelectModel, relations } from "drizzle-orm";
import { tickets } from "./tickets.table.js";

export const seats = pgTable("seats", {
	id: uuid("id").primaryKey().defaultRandom(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
	number: integer("number").notNull(),
	class: seatClassEnum("class").notNull(),
	status: seatStatusEnum("status").notNull().default(seatStatus.available),
	journeyId: uuid("journey_id")
		.notNull()
		.references(() => journeys.id),
	reservedAt: timestamp("reserved_at"),
});

export type SeatsTable = typeof seats;

export type Seat = InferSelectModel<SeatsTable>;

export const seatsRelations = relations(seats, ({ one, many }) => {
	return {
		journey: one(journeys, {
			fields: [seats.journeyId],
			references: [journeys.id],
		}),
		ticket: one(tickets, {
			fields: [seats.id],
			references: [tickets.seatId],
		}),
		passenger: one(tickets, {
			fields: [seats.id],
			references: [tickets.seatId],
		}),
	};
});
