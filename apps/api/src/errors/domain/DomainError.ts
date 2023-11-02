import { type IDomainErrorCodes, kDomainError } from "../codes.js";

export class DomainError<P = unknown> extends Error {
	protected _name: string;
	protected _code: IDomainErrorCodes;
	protected _payload?: P;
	protected _jsonPayload?: unknown;
	[kDomainError] = true;

	constructor(message: string, name: string, code: IDomainErrorCodes, payload?: P) {
		super(message);
		this._name = name;
		this._code = code;
		this._payload = payload;
		this._jsonPayload = this.processPayload(payload);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}

	public get name(): string {
		return this._name;
	}

	public get code(): IDomainErrorCodes {
		return this._code;
	}

	public get payload(): P | undefined {
		return this._payload;
	}

	public get jsonPayload(): unknown {
		return this._jsonPayload;
	}

	public toJSON(): object {
		return {
			name: this.name,
			message: this.message,
			cause: this.cause,
			payload: this.jsonPayload,
			stack: this.stack,
		};
	}

	public toString(): string {
		return `${this.name}: ${this.message}. Payload: ${JSON.stringify(this.jsonPayload)}`;
	}

	private processPayload(payload: unknown): unknown {
		const isObject = typeof payload === "object" && payload != null;
		try {
			if (isObject && "toJSON" in payload && typeof payload.toJSON === "function") {
				return payload.toJSON();
			}
			if (payload instanceof Error) {
				return payload.toString();
			}

			if (Array.isArray(payload)) {
				return payload.map(this.processPayload.bind(this));
			}

			if (isObject) {
				const result: Record<string, unknown> = {};
				Object.keys(payload).forEach((key) => {
					result[key] = this.processPayload(payload[key as keyof typeof payload]);
				});
				return result;
			}
		} catch (error) {
			let message: string;
			if (error instanceof Error) {
				message = error.toString();
			} else {
				message = JSON.stringify(error);
			}
			const err = new Error(
				`Error processing payload. ${message}. Payload: ${JSON.stringify(payload)}`,
			);
			console.error(err);
		}

		return payload;
	}
}
