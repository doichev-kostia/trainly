import { HttpClient } from "./http-client.js";
import { Customers } from "./resources/customers.js";
import { Journeys } from "./resources/journeys.js";
import { Stations } from "./resources/stations.js";
import { Seats } from "./resources/seats.js";
import { Checkout } from "./resources/checkout.js";
import { Bookings } from "./resources/bookings.js";

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
	public journeys: Journeys;
	public stations: Stations;
	public seats: Seats;
	public checkout: Checkout;
	public bookings: Bookings;

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
		this.journeys = new Journeys(this.client);
		this.stations = new Stations(this.client);
		this.seats = new Seats(this.client);
		this.checkout = new Checkout(this.client);
		this.bookings = new Bookings(this.client);
	}
}
