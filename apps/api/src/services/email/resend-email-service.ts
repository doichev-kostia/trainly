import { Resend } from "resend";
import { type EmailId, type EmailService } from "~/services/email/types.js";
import * as O from "effect/Option";
import { logger } from "~/configs/logger.js";
import path from "node:path";

export class ResendEmailService implements EmailService {
	#client: Resend;
	#from: string;

	constructor(apiKey: string, from: string) {
		this.#from = from;
		this.#client = new Resend(apiKey);
	}
	async send(to: string, subject: string, body: string): Promise<O.Option<EmailId>> {
		try {
			const response = await this.#client.emails.send({
				from: this.#from,
				to,
				subject,
				html: body,
			});

			if (response.error) {
				logger.error(response.error);
				return O.none();
			}

			return O.some(response.data?.id as EmailId);
		} catch (error) {
			logger.error(error);
			return O.none();
		}
	}
}
