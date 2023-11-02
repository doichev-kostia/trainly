import { DomainErrorCodes, kDomainError } from "../codes.js";
import { DomainError } from "./DomainError.js";

export class InvalidArgument<P = unknown> extends DomainError<P> {
	constructor(message: string, payload?: P) {
		super(message, "InvalidArgument", DomainErrorCodes.InvalidArgument, payload);
	}

	public static is(error: any): error is InvalidArgument {
		return error?.[kDomainError] && error?.code === DomainErrorCodes.InvalidArgument;
	}
}
