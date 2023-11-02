import { type ValueOf } from "type-fest";

export const kDomainError = Symbol("DomainError");

export const DomainErrorCodes = {
	NotFound: "NotFound",
	InvalidArgument: "InvalidArgument",
	InternalError: "InternalError",
} as const;

export type IDomainErrorCodes = ValueOf<typeof DomainErrorCodes>;
