import { type IdResponse, type ListResponse } from "@trainly/contracts";
import {
	type CreateCustomerBody,
	type CustomerResponse,
	type ListCustomerQuery,
	type RetrieveCustomerQuery,
	type UpdateCustomerBody,
} from "@trainly/contracts/customers";
import { type HttpClient } from "../http-client.js";
import { type RequestOptions } from "../options.js";

export class Customers {
	constructor(private client: HttpClient) {}

	async create(
		customer: CreateCustomerBody,
		requestOptions?: RequestOptions,
	): Promise<CustomerResponse> {
		const response = await this.client.post(
			"customers",
			{
				json: customer,
			},
			requestOptions,
		);

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async list(
		params?: ListCustomerQuery,
		requestOptions?: RequestOptions,
	): Promise<ListResponse<CustomerResponse>> {
		const response = await this.client.get(
			"customers",
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<ListResponse<CustomerResponse>>();

		return data;
	}

	async retrieve(
		id: string,
		params?: RetrieveCustomerQuery,
		requestOptions?: RequestOptions,
	): Promise<CustomerResponse> {
		const response = await this.client.get(
			`customers/${id}`,
			{
				searchParams: params,
			},
			requestOptions,
		);

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async update(
		id: string,
		params: UpdateCustomerBody,
		requestOptions?: RequestOptions,
	): Promise<CustomerResponse> {
		const response = await this.client.patch(
			`customers/${id}`,
			{
				json: params,
			},
			requestOptions,
		);

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async del(id: string, requestOptions?: RequestOptions): Promise<IdResponse> {
		const response = await this.client.delete(`customers/${id}`, {}, requestOptions);

		const data = await response.json<IdResponse>();

		return data;
	}
}
