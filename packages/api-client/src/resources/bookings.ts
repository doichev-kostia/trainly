import { type ExpansionQuery } from "@trainly/contracts";
import { type HttpClient } from "../http-client.js";
import { type RequestOptions } from "../options.js";
import { type BookingResponse } from "@trainly/contracts/bookings";

type RetrieveBookingQuery = ExpansionQuery;
export class Bookings {
	constructor(private client: HttpClient) {}

	async retrieve(
		id: string,
		params?: RetrieveBookingQuery,
		requestOptions?: RequestOptions,
	): Promise<BookingResponse> {
		const response = await this.client.get(
			`bookings/${id}`,
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<BookingResponse>();

		return data;
	}
}
