import { z } from "zod";

export const StripeWebhookHeadersSchema = z.object({
	"stripe-signature": z.string(),
});
