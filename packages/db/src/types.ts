import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const seat_class = {
	standard: "standard",
	premium: "premium",
} as const;
export type seat_class = (typeof seat_class)[keyof typeof seat_class];
export const seat_status = {
	available: "available",
	booked: "booked",
	reserved: "reserved",
} as const;
export type seat_status = (typeof seat_status)[keyof typeof seat_status];
export const booking_status = {
	reserved: "reserved",
	paid: "paid",
	cancelled: "cancelled",
} as const;
export type booking_status = (typeof booking_status)[keyof typeof booking_status];
export type address = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	country: string;
	city: string;
	street: string;
	streetNumber: string;
	index: string;
	stationId: string;
};
export type booking = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	status: booking_status;
	customerId: string | null;
};
export type customer = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	firstName: string;
	lastName: string;
	email: string;
};
export type journey = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	routeId: string;
	departureTime: Timestamp;
	delay: Generated<number>;
};
export type journey_stop = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	journeyId: string;
	stopId: string;
	expectedArrival: Timestamp;
	actualArrival: Timestamp | null;
	platformId: string | null;
};
export type passenger = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	firstName: string;
	lastName: string;
};
export type platform = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	name: string;
	stationId: string;
};
export type route = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	name: string;
	trainId: string;
	startStopId: string;
	endStopId: string;
	pricing: unknown;
};
export type seat = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	number: number;
	class: seat_class;
	journeyId: string;
	status: Generated<seat_status>;
};
export type station = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	name: string;
};
export type stop = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	durationFromPrevious: number;
	routeId: string;
	platformId: string;
	nextStopId: string | null;
};
export type ticket = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	passengerId: string;
	seatId: string;
	bookingId: string;
};
export type train = {
	id: Generated<string>;
	createdAt: Generated<Timestamp>;
	updatedAt: Timestamp;
	name: string;
	totalSeats: number;
	carriageCapacity: number;
	premiumCarriages: number;
};
export type DB = {
	address: address;
	booking: booking;
	customer: customer;
	journey: journey;
	journeyStop: journey_stop;
	passenger: passenger;
	platform: platform;
	route: route;
	seat: seat;
	station: station;
	stop: stop;
	ticket: ticket;
	train: train;
};
