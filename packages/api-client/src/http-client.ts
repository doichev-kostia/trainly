import ky, { type KyResponse, type Options as KyOptions } from "ky";
import { processOptions, type RequestOptions, type Options } from "./options.js";

type Input = string | URL | Request;
const requestMethods = ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"] as const;
type RequestMethod = (typeof requestMethods)[number];

export class HttpClient {
	private readonly apiKey: string;
	private readonly api: typeof ky;

	constructor(apiKey: string, options?: KyOptions) {
		this.apiKey = apiKey;
		this.api = ky.create({
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
			...options,
		});
	}

	public async get(
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const response = await this.api.get(input, processOptions(options, requestOptions));

		return response;
	}

	public async post(
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const response = await this.api.post(input, processOptions(options, requestOptions));

		return response;
	}

	public async put(
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const response = await this.api.put(input, processOptions(options, requestOptions));

		return response;
	}

	public async patch(
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const response = await this.api.patch(input, processOptions(options, requestOptions));

		return response;
	}

	public async delete(
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const response = await this.api.delete(input, processOptions(options, requestOptions));

		return response;
	}

	public async request(
		method: RequestMethod,
		input: Input,
		options?: Options,
		requestOptions?: RequestOptions,
	): Promise<KyResponse> {
		const opts = options ?? {};
		opts.method = method;
		const response = await this.api(input, processOptions(opts, requestOptions));

		return response;
	}
}
