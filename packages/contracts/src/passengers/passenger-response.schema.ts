import { z, type ZodType, type ZodTypeDef } from "zod";
import { TicketResponseSchema } from "../tickets/ticket-response.schema.js";

export const PassengerSchema = z.object({
	id: z.string(),
	firstName: z.string(),
	lastName: z.string(),
});

export type Passenger = z.infer<typeof PassengerSchema>;

export type PassengerResponse = z.infer<typeof PassengerSchema> & {
	ticket?: z.infer<typeof TicketResponseSchema>;
};

export const PassengerResponseSchema: ZodType<PassengerResponse, ZodTypeDef, unknown> =
	PassengerSchema.extend({
		ticket: z.lazy(() => TicketResponseSchema.optional()),
	});
