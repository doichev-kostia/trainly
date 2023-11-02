import { DomainErrorCodes, kDomainError } from "../codes.js";
import { DomainError } from "./DomainError.js";

export class NotFound<P = unknown> extends DomainError<P> {
	constructor(message: string, payload?: P) {
		super(message, "NotFound", DomainErrorCodes.NotFound, payload);
	}

	public static is(error: any): error is NotFound {
		return error?.[kDomainError] && error?.code === DomainErrorCodes.NotFound;
	}
}
