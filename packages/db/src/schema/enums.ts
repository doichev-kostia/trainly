import { pgEnum } from "drizzle-orm/pg-core";
import { castToEnum, type ValueOf } from "../utils.js";

export const seatClass = {
	standard: "standard",
	premium: "premium",
} as const;

export type SeatClass = ValueOf<typeof seatClass>;

export const seatClassEnum = pgEnum("seat_class", castToEnum(seatClass));

export const seatStatus = {
	available: "available",
	reserved: "reserved",
	booked: "booked",
} as const;

export type SeatStatus = ValueOf<typeof seatStatus>;

export const seatStatusEnum = pgEnum("seat_status", castToEnum(seatStatus));

export const bookingStatus = {
	reserved: "reserved",
	paid: "paid",
	cancelled: "cancelled",
} as const;

export type BookingStatus = ValueOf<typeof bookingStatus>;

export const bookingStatusEnum = pgEnum("booking_status", castToEnum(bookingStatus));
