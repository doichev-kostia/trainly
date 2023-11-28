import type * as O from "effect/Option";
import type * as B from "effect/Brand";

export type EmailId = string & B.Brand<"EmailId">;

export interface EmailService {
	send(to: string, subject: string, body: string): Promise<O.Option<EmailId>>;
}
