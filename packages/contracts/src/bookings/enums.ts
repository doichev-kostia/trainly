import { z } from "zod";
import { castToEnum } from "../utils.js";

export const BookingStatus = {
	reserved: "reserved",
	paid: "paid",
	cancelled: "cancelled",
};

export const bookingStatusSchema = z.enum(castToEnum(BookingStatus));

export type BookingStatusEnum = z.infer<typeof bookingStatusSchema>;
