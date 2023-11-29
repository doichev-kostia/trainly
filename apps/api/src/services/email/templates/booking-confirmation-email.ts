import { type EmailTemplate } from "~/services/email/templates/types.js";
import path from "node:path";
import fs from "fs";

type Variables = {
	url: string;
};

export class BookingConfirmationEmail implements EmailTemplate {
	#templatePath = path.resolve("assets", "booking-confirmation.html");
	#variables: Variables;
	#html: string | null = null;
	constructor(variables: Variables) {
		this.#variables = variables;
	}

	async generate(): Promise<string> {
		if (this.#html) {
			return this.#html;
		}

		const template = await fs.promises.readFile(this.#templatePath, "utf-8");
		const html = template.replace("{{bookingLink}}", this.#variables.url);
		this.#html = html;

		return html;
	}
}
