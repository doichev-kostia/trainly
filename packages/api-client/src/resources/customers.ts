import { type IdResponse, type ListResponse } from "@trainly/contracts";
import {
	type CreateCustomerBody,
	type CustomerResponse,
	type UpdateCustomerBody,
} from "@trainly/contracts/customers";
import { type HttpClient } from "../http-client.js";

export class Customers {
	constructor(private client: HttpClient) {}

	async list(): Promise<ListResponse<CustomerResponse>> {
		const response = await this.client.get("/customers");

		const data = await response.json<ListResponse<CustomerResponse>>();

		return data;
	}

	async retrieve(id: string): Promise<CustomerResponse> {
		const response = await this.client.get(`/customers/${id}`);

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async create(customer: CreateCustomerBody): Promise<CustomerResponse> {
		const response = await this.client.post("/customers", {
			json: customer,
		});

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async update(id: string, customer: UpdateCustomerBody): Promise<CustomerResponse> {
		const response = await this.client.patch(`/customers/${id}`, {
			json: customer,
		});

		const data = await response.json<CustomerResponse>();

		return data;
	}

	async del(id: string): Promise<IdResponse> {
		const response = await this.client.delete(`/customers/${id}`);

		const data = await response.json<IdResponse>();

		return data;
	}
}
