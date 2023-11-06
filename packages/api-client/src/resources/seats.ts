import { type RequestOptions } from "../options.js";
import { type HttpClient } from "../http-client.js";
import { type ListSeatsQuery, type SeatResponse } from "@trainly/contracts/seats";
import { type ListResponse } from "@trainly/contracts";

export class Seats {
	constructor(private client: HttpClient) {}

	async list(
		params?: ListSeatsQuery,
		requestOptions?: RequestOptions,
	): Promise<ListResponse<SeatResponse>> {
		const response = await this.client.get(
			"seats",
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<ListResponse<SeatResponse>>();

		return data;
	}

	async reserve(ids: string[], requestOptions?: RequestOptions): Promise<void> {
		await this.client.post(
			"seats/reserve",
			{
				json: { ids: ids },
			},
			requestOptions,
		);
	}
}
