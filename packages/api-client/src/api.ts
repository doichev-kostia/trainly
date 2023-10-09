import { HttpClient } from "./http-client.js";
import { Customers } from "./resources/customers.js";

type Options = {
	host?: string;
	port?: number;
	protocol?: "http" | "https";
	basePath?: string;
};

const DEFAULT_HOST = "api.trainly.doichevkostia.dev";
const DEFAULT_PROTOCOL = "https";
const DEFAULT_BASE_PATH = "/v1";

export class API {
	private readonly client: HttpClient;
	private options: Options;

	public customers: Customers;

	constructor(apiKey: string, options?: Options) {
		this.options = {
			host: options?.host ?? DEFAULT_HOST,
			port: options?.port,
			protocol: options?.protocol ?? DEFAULT_PROTOCOL,
			basePath: options?.basePath ?? DEFAULT_BASE_PATH,
		};
		const url = new URL(
			`${this.options.protocol}://${this.options.host}${this.options.basePath}`,
		);

		if (this.options.port) {
			url.port = this.options.port.toString();
		}

		this.client = new HttpClient(apiKey, {
			prefixUrl: url.toString(),
		});
		this.customers = new Customers(this.client);
	}
}
