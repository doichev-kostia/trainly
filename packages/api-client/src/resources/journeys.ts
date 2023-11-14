import { type HttpClient } from "../http-client.js";
import { type JourneyResponse, type ListJourneysQuery } from "@trainly/contracts/journeys";
import { type RequestOptions } from "../options.js";
import { type ExpansionQuery, type ListResponse } from "@trainly/contracts";
import { type SeatClassEnum } from "@trainly/contracts/seats";

type RetrieveJourneyQuery = ExpansionQuery;

export class Journeys {
	constructor(private client: HttpClient) {}

	async list(
		params: ListJourneysQuery,
		requestOptions?: RequestOptions,
	): Promise<ListResponse<JourneyResponse>> {
		const response = await this.client.get(
			"journeys",
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<ListResponse<JourneyResponse>>();

		return data;
	}

	async retrieve(
		id: string,
		params?: RetrieveJourneyQuery,
		requestOptions?: RequestOptions,
	): Promise<JourneyResponse> {
		const response = await this.client.get(
			`journeys/${id}`,
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<JourneyResponse>();

		return data;
	}

	async retrievePricing(
		id: string,
		requestOptions?: RequestOptions,
	): Promise<Record<SeatClassEnum, number>> {
		const response = await this.client.get(`journeys/${id}/pricing`, undefined, requestOptions);

		const data = await response.json<Record<SeatClassEnum, number>>();

		return data;
	}
}
