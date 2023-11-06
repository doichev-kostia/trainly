import { type ExpansionQuery, type IdResponse, type ListResponse } from "@trainly/contracts";
import {
	type CreateStationBody,
	type StationResponse,
	type ListStationQuery,
	type UpdateStationBody,
} from "@trainly/contracts/stations";
import { type HttpClient } from "../http-client.js";
import { type RequestOptions } from "../options.js";

type RetrieveStationQuery = ExpansionQuery;

export class Stations {
	constructor(private client: HttpClient) {}

	async create(
		station: CreateStationBody,
		requestOptions?: RequestOptions,
	): Promise<StationResponse> {
		const response = await this.client.post(
			"stations",
			{
				json: station,
			},
			requestOptions,
		);

		const data = await response.json<StationResponse>();

		return data;
	}

	async list(
		params?: ListStationQuery,
		requestOptions?: RequestOptions,
	): Promise<ListResponse<StationResponse>> {
		const response = await this.client.get(
			"stations",
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<ListResponse<StationResponse>>();

		return data;
	}

	async retrieve(
		id: string,
		params?: RetrieveStationQuery,
		requestOptions?: RequestOptions,
	): Promise<StationResponse> {
		const response = await this.client.get(
			`stations/${id}`,
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<StationResponse>();

		return data;
	}

	async update(
		id: string,
		params: UpdateStationBody,
		requestOptions?: RequestOptions,
	): Promise<StationResponse> {
		const response = await this.client.patch(
			`stations/${id}`,
			{
				json: params,
			},
			requestOptions,
		);

		const data = await response.json<StationResponse>();

		return data;
	}

	async del(id: string, requestOptions?: RequestOptions): Promise<IdResponse> {
		const response = await this.client.delete(`stations/${id}`, {}, requestOptions);

		const data = await response.json<IdResponse>();

		return data;
	}
}
