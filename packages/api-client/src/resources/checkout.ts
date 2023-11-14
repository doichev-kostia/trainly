import { type CreateBookingBody } from "@trainly/contracts/bookings";
import { type Url } from "@trainly/contracts";
import { type RequestOptions } from "../options.js";
import { type HttpClient } from "../http-client.js";

export class Checkout {
	constructor(private client: HttpClient) {}

	async create(body: CreateBookingBody, requestOptions?: RequestOptions): Promise<Url> {
		const response = await this.client.post(
			"checkout",
			{
				json: body,
			},
			requestOptions,
		);

		const data = await response.json<Url>();

		return data;
	}
}
