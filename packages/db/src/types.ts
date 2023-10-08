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
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	country: string;
	city: string;
	street: string;
	street_number: string;
	index: string;
	station_id: string;
};
export type booking = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	status: booking_status;
	customer_id: string | null;
};
export type customer = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	first_name: string;
	last_name: string;
	email: string;
};
export type journey = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	route_id: string;
	departure_time: Timestamp;
	delay: Generated<number>;
};
export type journey_stop = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	journey_id: string;
	stop_id: string;
	expected_arrival: Timestamp;
	actual_arrival: Timestamp | null;
	platform_id: string | null;
};
export type passenger = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	first_name: string;
	last_name: string;
};
export type platform = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	name: string;
	station_id: string;
};
export type route = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	name: string;
	train_id: string;
	start_stop_id: string;
	end_stop_id: string;
	pricing: unknown;
};
export type seat = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	number: number;
	class: seat_class;
	journey_id: string;
	status: Generated<seat_status>;
};
export type station = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	name: string;
};
export type stop = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	duration_from_previous: number;
	route_id: string;
	platform_id: string;
	next_stop_id: string | null;
};
export type ticket = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	passenger_id: string;
	seat_id: string;
	booking_id: string;
};
export type train = {
	id: string;
	created_at: Generated<Timestamp>;
	updated_at: Timestamp;
	name: string;
	total_seats: number;
	carriage_capacity: number;
	premium_carriages: number;
};
export type DB = {
	address: address;
	booking: booking;
	customer: customer;
	journey: journey;
	journey_stop: journey_stop;
	passenger: passenger;
	platform: platform;
	route: route;
	seat: seat;
	station: station;
	stop: stop;
	ticket: ticket;
	train: train;
};
