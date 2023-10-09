import { z } from "zod";
import ky, { type KyResponse, type Options } from "ky";

type Input = string | URL | Request;
const requestMethods = ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"] as const;
const requestMethodSchema = z.enum(requestMethods);
type RequestMethod = (typeof requestMethods)[number];

export class HttpClient {
	private readonly apiKey: string;
	private readonly api: typeof ky;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
		this.api = ky.create({
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});
	}

	public async get(input: Input, options?: Options): Promise<KyResponse> {
		const response = await this.api.get(input, options);

		return response;
	}

	public async post(input: Input, options?: Options): Promise<KyResponse> {
		const response = await this.api.post(input, options);

		return response;
	}

	public async put(input: Input, options?: Options): Promise<KyResponse> {
		const response = await this.api.put(input, options);

		return response;
	}

	public async patch(input: Input, options?: Options): Promise<KyResponse> {
		const response = await this.api.patch(input, options);

		return response;
	}

	public async delete(input: Input, options?: Options): Promise<KyResponse> {
		const response = await this.api.delete(input, options);

		return response;
	}

	public async request(
		method: RequestMethod,
		input: Input,
		options?: Options,
	): Promise<KyResponse> {
		const requestOptions = options ?? {};
		requestOptions.method = method;
		const response = await this.api(input, requestOptions);

		return response;
	}
}
