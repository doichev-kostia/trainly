import { BaseRepository } from "#base-repository";

import { bookings } from "@trainly/db/schema/bookings";
import { db, eq } from "@trainly/db";
import { passengers } from "@trainly/db/schema/passengers";
import { bookingStatus } from "@trainly/db/schema/enums";
import { tickets } from "@trainly/db/schema/tickets";

type Seat = {
	id: string;
	passenger: {
		firstName: string;
		lastName: string;
	};
};

export class BookingRepository {
	private static instance: BookingRepository | undefined;

	private base: BaseRepository<typeof bookings, typeof db>;

	private constructor(database: typeof db, table: typeof bookings) {
		this.base = new BaseRepository(table, database);
	}

	public static getInstance() {
		if (!BookingRepository.instance) {
			BookingRepository.instance = new BookingRepository(db, bookings);
		}

		return BookingRepository.instance;
	}

	public async createBooking(seats: Seat[], email: string, customerId?: string) {
		const booking = await db.transaction(async (trx) => {
			const [booking] = await trx
				.insert(bookings)
				.values({
					email,
					status: bookingStatus.reserved,
					customerId: customerId ?? null,
				})
				.returning({
					id: bookings.id,
				});

			const bookingPassengers = await trx
				.insert(passengers)
				.values(
					seats.map((seat) => {
						return {
							firstName: seat.passenger.firstName,
							lastName: seat.passenger.lastName,
						};
					}),
				)
				.returning({
					id: passengers.id,
					firstName: passengers.firstName,
					lastName: passengers.lastName,
				});

			const psgrMap = new Map<string, string>();

			bookingPassengers.forEach((psgr) => {
				psgrMap.set(psgr.firstName + psgr.lastName, psgr.id);
			});

			const bookingTickets = await trx.insert(tickets).values(
				seats.map((seat) => {
					const passengerId = psgrMap.get(
						seat.passenger.firstName + seat.passenger.lastName,
					)!;

					return {
						bookingId: booking.id,
						seatId: seat.id,
						passengerId,
					};
				}),
			);

			// TODO: reserve seats

			return booking;
		});

		return booking.id;
	}

	async retrieve(id: string, expand?: string[]) {
		return this.base.retrieve(id, expand);
	}
}
