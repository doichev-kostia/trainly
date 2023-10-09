import { HttpClient } from "./http-client.js";
import { Customers } from "./resources/customers.js";

export class API {
	private readonly client: HttpClient;

	public customers: Customers;

	constructor(apiKey: string) {
		this.client = new HttpClient(apiKey);
		this.customers = new Customers(this.client);
	}
}
