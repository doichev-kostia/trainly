import { z } from "zod";
import { castToEnum } from "../utils.js";

export const SeatClass = {
	standard: "standard",
	premium: "premium",
};

export const seatClassSchema = z.enum(castToEnum(SeatClass));

export type SeatClassEnum = z.infer<typeof seatClassSchema>;

export const SeatStatus = {
	available: "available",
	reserved: "reserved",
	booked: "booked",
};

export const seatStatusSchema = z.enum(castToEnum(SeatStatus));

export type SeatStatusEnum = z.infer<typeof seatStatusSchema>;
