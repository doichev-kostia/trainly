import { DomainErrorCodes, kDomainError } from "../codes.js";
import { DomainError } from "./DomainError.js";

export class InternalError<P = unknown> extends DomainError<P> {
	constructor(message: string, payload?: P) {
		super(message, "InternalError", DomainErrorCodes.InternalError, payload);
	}

	public static is(error: any): error is InternalError {
		return error?.[kDomainError] && error?.code === DomainErrorCodes.InternalError;
	}
}
