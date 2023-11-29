import { type EmailId, type EmailService } from "~/services/email/types.js";
import * as O from "effect/Option";

export class MockEmailService implements EmailService {
	send(to: string, subject: string, body: string): Promise<O.Option<EmailId>> {
		return Promise.resolve(O.some("mock-email-id" as EmailId));
	}
}
